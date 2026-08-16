import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { nav, profile } from "@/data/profile";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-bar">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__mark">ДВ</span>
          <span className="brand__name">{profile.name}</span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        <nav className={open ? "nav is-open" : "nav"} aria-label="Разделы">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-bar">
        <p>{profile.name}</p>
        <p className="muted">ИИ-продукты · агентство QLAN · 2026</p>
      </div>
    </footer>
  );
}
