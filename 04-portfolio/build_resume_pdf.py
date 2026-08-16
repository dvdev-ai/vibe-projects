#!/usr/bin/env python3
"""Резюме Данилы Вертия: ч/б, QLAN в опыте, без Qwen, проекты короче + OpenClaw/ZeroClaw."""

from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

OUT = Path(__file__).resolve().parent / "Данила_Вертий_резюме.pdf"
FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_B = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

pdfmetrics.registerFont(TTFont("A", FONT))
pdfmetrics.registerFont(TTFont("AB", FONT_B))

W, H = A4
SIDE_W = 188
MARGIN = 14
INK = HexColor("#111111")
MUTED = HexColor("#333333")
LINE = HexColor("#111111")
SOFT = HexColor("#e6e6e6")
SIDE_BG = HexColor("#000000")
BANNER_LINE = HexColor("#000000")


def wrap(c, text, font, size, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if c.stringWidth(trial, font, size) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines or [""]


def draw_wrapped(c, text, x, y, font, size, max_w, leading, color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    for line in wrap(c, text, font, size, max_w):
        if y < 28:
            return y
        c.drawString(x, y, line)
        y -= leading
    return y


def section_title(c, text, x, y, max_w, dark=False):
    c.setFont("AB", 10)
    c.setFillColor(white if dark else INK)
    c.drawString(x, y, text)
    y -= 3
    c.setStrokeColor(white if dark else LINE)
    c.setLineWidth(1)
    c.line(x, y, x + min(max_w, 110), y)
    return y - 10


def bullet_block(c, items, x, y, max_w, size=8, leading=10, color=INK, bottom=28):
    for item in items:
        lines = wrap(c, item, "A", size, max_w - 9)
        c.setFillColor(color)
        c.setFont("A", size)
        if y < bottom:
            return y
        c.drawString(x, y, "•")
        yy = y
        for line in lines:
            if yy < bottom:
                return yy
            c.drawString(x + 9, yy, line)
            yy -= leading
        y = yy - 1.5
    return y


def banner(c, title, x, y, w):
    h = 14
    c.setFillColor(SOFT)
    c.rect(x, y - 3, w, h, fill=1, stroke=0)
    c.setStrokeColor(BANNER_LINE)
    c.setLineWidth(0.6)
    c.line(x, y - 3, x, y - 3 + h)
    c.setFillColor(INK)
    c.setFont("AB", 8)
    c.drawString(x + 5, y + 1, title)
    return y - 14


def draw_sidebar(c, page=1):
    c.setFillColor(SIDE_BG)
    c.rect(0, 0, SIDE_W, H, fill=1, stroke=0)

    x = MARGIN
    max_w = SIDE_W - 2 * MARGIN

    if page == 1:
        c.setStrokeColor(white)
        c.setLineWidth(1.2)
        c.circle(SIDE_W / 2, H - 52, 28, fill=0, stroke=1)
        c.setFillColor(white)
        c.setFont("AB", 16)
        c.drawCentredString(SIDE_W / 2, H - 57, "ДВ")
        y = H - 100
    else:
        y = H - 36

    y = section_title(c, "КОНТАКТЫ", x, y, max_w, dark=True)
    for line in [
        "Самара · удаленка",
        "Telegram: @danyavertiy",
        "Email: vertiydanila@mail.ru",
    ]:
        y = draw_wrapped(c, line, x, y, "A", 7.5, max_w, 10, white) - 2
    y -= 8

    y = section_title(c, "ОБРАЗОВАНИЕ", x, y, max_w, dark=True)
    for line in [
        "Самарский национальный исследовательский университет имени академика С.П. Королева",
        "Направление: 01.03.03 Механика и математическое моделирование",
        "Профиль: вычислительная механика",
        "Очная форма · 2023–2027",
        "Закончил 3 курс",
    ]:
        y = draw_wrapped(c, line, x, y, "A", 7, max_w, 9, white) - 3
    y -= 8

    y = section_title(c, "НАВЫКИ", x, y, max_w, dark=True)
    blocks = [
        (
            "Работа с LLM:",
            [
                "декомпозиция задач под модель",
                "промпт-инжиниринг",
                "оценка качества ответа",
                "итерации до рабочего результата",
            ],
        ),
        (
            "Описание требований:",
            [
                "use cases, user stories, user flow",
                "функциональные спецификации",
                "постановка и контроль задач",
                "DoD, короткий бэклог MVP",
            ],
        ),
        (
            "Инструменты AI:",
            [
                "Cursor — основная среда",
                "Claude Sonnet / Fable",
                "GPT Codex, Sol 5.6",
                "Solute, Speechbot",
            ],
        ),
        (
            "Сборка и запуск:",
            [
                "React / Vite",
                "Telegram-боты",
                "Python",
                "VPS, Docker, .env / API",
                "деплой и проверка",
            ],
        ),
        (
            "Данные и операционка:",
            [
                "Excel / Power BI",
                "Google Analytics",
                "CRM, Jira, Slack",
            ],
        ),
        (
            "Качества:",
            [
                "закрываю контур целиком",
                "смотрю на результат",
                "документирую ход работы",
                "отдаю вещь, которую можно проверить",
            ],
        ),
    ]
    for title, items in blocks:
        if y < 40:
            break
        c.setFillColor(white)
        c.setFont("AB", 7.5)
        c.drawString(x, y, title)
        y -= 10
        y = bullet_block(c, items, x, y, max_w, size=7, leading=9, color=white, bottom=36) - 5


def build():
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("Данила Вертий — резюме")
    c.setAuthor("Данила Вертий")
    draw_sidebar(c, page=1)

    x0 = SIDE_W + MARGIN
    max_w = W - SIDE_W - 2 * MARGIN
    y = H - 32

    c.setFillColor(INK)
    c.setFont("AB", 16)
    c.drawString(x0, y, "ВЕРТИЙ ДАНИЛА")
    y -= 12
    c.setFont("A", 8.5)
    c.setFillColor(MUTED)
    c.drawString(x0, y, "ИИ-продукты · вайбкодинг · агентство QLAN")
    y -= 16

    y = section_title(c, "О СЕБЕ", x0, y, max_w)
    about = [
        "С начала 2026 работаю в агентстве QLAN: собираю ИИ-продукты — боты, сайты, кабинеты, автоматизацию",
        "Довожу до состояния «можно пользоваться»: не макет, а рабочая вещь",
        "Работаю с LLM и вайбкодингом: ставлю задачу, контролирую результат, решаю, что выпускать",
        "Параллельно собираю свои продукты и пилоты — от идеи до рабочего демо",
        "Ищу роль, где нужно быстро собрать результат и дать его проверить",
    ]
    y = bullet_block(c, about, x0, y, max_w, size=8, leading=10) - 8

    y = section_title(c, "ОПЫТ", x0, y, max_w)
    c.setFont("AB", 9)
    c.setFillColor(INK)
    c.drawString(x0, y, "ИИ-продукты · агентство QLAN")
    y -= 11
    c.setFont("A", 7.5)
    c.setFillColor(MUTED)
    c.drawString(x0, y, "Начало 2026 — сейчас · удаленка")
    y -= 11
    y = bullet_block(
        c,
        [
            "Беру задачу, уточняю рамку, сам довожу до рабочего результата",
            "Собираю лендинги, боты, кабинеты и автоматизацию",
            "Участвую в продуктовых задачах агентства: от идеи до демо, которое можно показать",
            "Фиксирую ход работы, чтобы результат не зависел только от памяти",
        ],
        x0,
        y,
        max_w,
        size=8,
        leading=10,
    )
    y -= 6
    c.setFont("AB", 9)
    c.setFillColor(INK)
    c.drawString(x0, y, "Продуктовая и операционная работа")
    y -= 11
    c.setFont("A", 7.5)
    c.setFillColor(MUTED)
    c.drawString(x0, y, "2024 — 2025 · удаленка")
    y -= 11
    y = bullet_block(
        c,
        [
            "Закрывал задачи до понятного результата",
            "Связывал продукт, каналы и качество",
            "Привык отдавать законченный кусок, а не «почти сделал»",
        ],
        x0,
        y,
        max_w,
        size=8,
        leading=10,
    )
    y -= 8

    y = section_title(c, "ПРОЕКТЫ", x0, y, max_w)

    projects = [
        {
            "title": "VOID CONNECT — VPN-СЕРВИС",
            "meta": "Свой продукт · полный контур",
            "role": "Собрал и довёл до запуска коммерческий VPN-сервис",
            "bullets": [
                "спроектировал продуктовый контур: витрина, кабинет, тарифы, поддержка",
                "подобрал и купил VPS, настроил DNS, SSH и базовую безопасность узлов",
                "развернул панель управления подписками и ноды трафика на отдельных серверах",
                "прописал переменные окружения, API-ключи и связку бэкенда с выдачей доступа",
                "собрал сайт и личный кабинет: статус подписки, подключение, сценарий онбординга",
                "сделал Telegram-бота для входа, статуса, рефералок и быстрых команд пользователя",
                "настроил split-tunneling и пользовательский сценарий «кнопка работает»",
                "связал оплату, выдачу профиля и проверку, что доступ реально поднимается",
                "задокументировал деплой и состояние инфраструктуры для поддержки",
                "Результат: живой сервис в сети — сайт, кабинет, бот и инфраструктура в одном контуре",
            ],
        },
        {
            "title": "АГОРА — TELEGRAM-БОТ",
            "meta": "Личный проект",
            "role": "Собрал для себя ИИ-собеседника в Telegram с набором рабочих команд",
            "bullets": [
                "спроектировал тон и сценарии: разговор как с человеком, а не шаблонный чат",
                "собрал команды: антикризисный протокол, чек-ап, статистика, сводка недели",
                "добавил голосовой ввод/вывод, напоминания, экспорт и контроль данных",
                "сделал вспомогательные команды: разбор идеи, разбор вакансии, сброс контекста",
                "настроил память короткого диалога и хранение чек-апов",
                "поднял бота на VPS: Python, polling, переменные окружения, ключи провайдера LLM",
                "сайт под продукт оставил сырым — в прод не выводил; опора на бота",
                "Результат: рабочий личный бот, которым можно пользоваться каждый день",
            ],
        },
        {
            "title": "КОНТЕКСТНЫЙ АССИСТЕНТ — OPENCLAW / ZEROCLAW",
            "meta": "Личный / экспериментальный",
            "role": "Собрал ассистента, который держит контекст задач и ускоряет работу",
            "bullets": [
                "собрал контур на базе OpenClaw и ZeroClaw",
                "связал вход задачи, контекст и ответ модели в один рабочий сценарий",
                "настроил передачу контекста между шагами, чтобы не терять смысл диалога",
                "описал сценарии использования: разбор задачи, уточнение рамки, черновик решения",
                "проверил цикл «запрос → контекст → ответ → правка» на своих рабочих кейсах",
                "Результат: ассистент, который помогает закрывать задачи быстрее за счет памяти контекста",
            ],
        },
        {
            "title": "ПАРСИНГ ДОКУМЕНТОВ И ПРИКЛАДНЫЕ СБОРКИ",
            "meta": "Пилоты рядом с основной работой",
            "role": "Делал прикладные ИИ- и операционные сборки под конкретную пользу",
            "bullets": [
                "описал use cases разбора документов: что достаем и зачем бизнесу",
                "собрал извлечение сущностей: даты, суммы, контакты, стороны",
                "сделал выгрузку в таблицу и CSV",
                "собрал прикладной датасет контактов адвокатских бюро Самары",
                "подготовил программу вебинара по нейросетям: 90 минут, сценарии, KPI",
                "по ходу пилотов поднимал VPS, прописывал API и проверял запуск",
                "Результат: набор рабочих пилотов — от данных до образовательной программы",
            ],
        },
    ]

    for p in projects:
        if y < 110:
            c.showPage()
            draw_sidebar(c, page=2)
            y = H - 36
            y = section_title(c, "ПРОЕКТЫ (продолжение)", x0, y, max_w)
        y = banner(c, p["title"], x0, y, max_w)
        c.setFont("A", 7)
        c.setFillColor(MUTED)
        c.drawString(x0, y, p["meta"])
        y -= 10
        y = draw_wrapped(c, f"Роль: {p['role']}", x0, y, "A", 7.5, max_w, 9.5) - 2
        c.setFont("AB", 7.5)
        c.setFillColor(INK)
        c.drawString(x0, y, "Что сделал:")
        y -= 10
        y = bullet_block(c, p["bullets"], x0, y, max_w, size=7.5, leading=9.5) - 6

    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
