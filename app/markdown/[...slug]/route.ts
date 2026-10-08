import { landingPages, type LandingPath } from "../../landing-data";

type Params = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return Object.keys(landingPages).map((path) => ({ slug: path.slice(1).split("/") }));
}

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  if (!(path in landingPages)) return new Response("Not found", { status: 404 });

  const page = landingPages[path as LandingPath];
  const lines = [
    `# ${page.title}`,
    "",
    page.intro,
    "",
    `Источник: https://maskarad-teatr.ru${path}`,
    "",
    "## Коротко",
    "",
    ...page.facts.map((fact) => `- ${fact}`),
    "",
    ...page.sections.flatMap((section) => [`## ${section.title}`, "", section.text, ""]),
    "## Что входит",
    "",
    ...page.includes.map((item) => `- ${item}`),
    "",
    "## Частые вопросы",
    "",
    ...page.faq.flatMap((item) => [`### ${item.question}`, "", item.answer, ""]),
    "## Связаться",
    "",
    "Телефон: +7 995 121-94-67",
    `Форма заявки: https://maskarad-teatr.ru${path}#zayavka`,
    ""
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<https://maskarad-teatr.ru${path}>; rel="canonical"`,
      "Cache-Control": "public, max-age=3600"
    }
  });
}
