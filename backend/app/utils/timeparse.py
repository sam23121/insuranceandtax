from datetime import date, datetime, time, timedelta


def parse_hhmm(s: str) -> time:
    return datetime.strptime(s.strip(), "%H:%M").time()


def format_hhmm(t: time) -> str:
    return f"{t.hour:02d}:{t.minute:02d}"


def iter_time_strings(start: str, end: str, interval_minutes: int) -> list[str]:
    st = datetime.combine(date.min, parse_hhmm(start))
    en = datetime.combine(date.min, parse_hhmm(end))
    out: list[str] = []
    cur = st
    while cur <= en:
        out.append(cur.strftime("%H:%M"))
        cur += timedelta(minutes=interval_minutes)
    return out


def api_weekday_matches_date(api_weekday: int, d: date) -> bool:
    """api_weekday uses JS convention: 0=Sunday … 6=Saturday."""
    py_weekday = (api_weekday + 6) % 7  # Mon=0 in Python
    return d.weekday() == py_weekday
