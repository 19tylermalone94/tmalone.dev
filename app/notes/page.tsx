import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { getAllNotes, formatDate } from "@/content/notes";

export const metadata: Metadata = {
  title: "Field Notes | Tyler Malone",
  description: "Dated ideas and rough drafts on agent memory, AI systems, and software.",
};

export default function NotesIndex() {
  const notes = getAllNotes();

  return (
    <div>
      <Nav />

      <main className="shell">
        <header className="page-head">
          <h1>Field Notes</h1>
          <p>Dated ideas, rough drafts, and open questions — mostly about agent memory and AI systems.</p>
        </header>

        <section className="section accent-violet">
          <div className="section-bar">
            <span className="section-bar__label">[ NOTES ]</span>
            <span className="section-bar__line" />
          </div>

          {notes.map((note) => (
            <div className="note" key={note.slug}>
              <div className="note__date">{formatDate(note.date)}</div>
              <div className="note__body">
                <h3 className="note__title">
                  <Link href={`/notes/${note.slug}`}>{note.title}</Link>
                </h3>
                <p className="note__desc">{note.description}</p>
                {note.status && <span className="note__status">[ {note.status} ]</span>}
              </div>
            </div>
          ))}
        </section>

        <Link href="/" className="back-link">
          ← back home
        </Link>

        <Footer />
      </main>
    </div>
  );
}
