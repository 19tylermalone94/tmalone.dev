import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { getAllNotes, getNote, formatDate } from "@/content/notes";

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return { title: "Note not found | Tyler Malone" };
  return {
    title: `${note.title} | Field Notes`,
    description: note.description,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  return (
    <div>
      <Nav />

      <main className="shell">
        <article className="article" style={{ paddingTop: "64px" }}>
          <p className="article__meta">
            {formatDate(note.date)}
            {note.status && ` · [ ${note.status} ]`}
          </p>
          <h1 className="article__title">{note.title}</h1>
          <p className="article__lede">{note.description}</p>

          <div className="article__body">
            {note.content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>

        <Link href="/notes" className="back-link">
          ← all field notes
        </Link>

        <Footer />
      </main>
    </div>
  );
}
