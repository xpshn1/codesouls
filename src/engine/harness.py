# Runs learner code and a challenge's tests, returning one result per test (spec FR-5).
# Loaded into Pyodide by the worker (src/engine/python.worker.ts) and by the Node test suites.
#
# A test is {id, call, expected, setup?}: `setup` (optional) runs before the learner's code,
# e.g. `log = []` to give the code its input; `call` and `expected` are Python expressions.
import contextlib
import io
import json
import traceback

LEARNER_FILE = "<your code>"
MAX_OUTPUT = 4000
_SYNTAX = {"SyntaxError", "IndentationError", "TabError"}


def _trim(text):
    if len(text) <= MAX_OUTPUT:
        return text
    return text[:MAX_OUTPUT] + "\n... (output cut)"


def _describe(exc):
    line = None
    if isinstance(exc, SyntaxError) and exc.filename == LEARNER_FILE:
        line = exc.lineno
    for frame, lineno in traceback.walk_tb(exc.__traceback__):
        if frame.f_code.co_filename == LEARNER_FILE:
            line = lineno
    raw = "".join(traceback.format_exception_only(type(exc), exc)).strip()
    return {"type": type(exc).__name__, "detail": str(exc), "line": line, "raw": raw}


def _no_input(*_args, **_kwargs):
    raise RuntimeError("input() is not available in challenges")


def _fresh():
    return {"__name__": "__main__", "input": _no_input}


def _is_number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def _same(actual, expected):
    if _is_number(actual) and _is_number(expected):
        return abs(actual - expected) < 1e-9
    return type(actual) is type(expected) and actual == expected


def run_job(code, tests_json):
    tests = json.loads(tests_json)
    result = {"stdout": "", "error": None, "results": []}

    try:
        compiled = compile(code, LEARNER_FILE, "exec")
    except SyntaxError as exc:
        result["error"] = _describe(exc)
        result["results"] = [{"id": t["id"], "status": "error", "error": result["error"]} for t in tests]
        return json.dumps(result)

    # The visible run: the first test's setup (if any), then the learner's code, printing captured.
    output = io.StringIO()
    shown = _fresh()
    try:
        with contextlib.redirect_stdout(output):
            exec((tests[0].get("setup") or "") if tests else "", shown)
            exec(compiled, shown)
    except BaseException as exc:  # noqa: BLE001 - SystemExit and friends are learner errors too
        result["error"] = _describe(exc)
    result["stdout"] = _trim(output.getvalue())

    for test in tests:
        expected = eval(test["expected"], {})
        scope = _fresh()
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                exec(test.get("setup") or "", scope)
                exec(compiled, scope)
                actual = eval(test["call"], scope)
        except BaseException as exc:  # noqa: BLE001
            result["results"].append(
                {"id": test["id"], "status": "error", "expected": repr(expected), "error": _describe(exc)}
            )
            continue
        result["results"].append(
            {
                "id": test["id"],
                "status": "pass" if _same(actual, expected) else "fail",
                "expected": repr(expected),
                "actual": repr(actual),
            }
        )

    return json.dumps(result)
