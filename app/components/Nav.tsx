import Link from "next/link";

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link href="/" className="nav__name">
          Tyler Malone
        </Link>
        <div className="nav__links">
          <Link href="/#about">About</Link>
          <Link href="/work">Work</Link>
          <Link href="/#contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
