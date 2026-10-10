import Image from "next/image";
import { portfolioPhotos, photosForPage } from "./photo-library";
import { PhotoOpenButton } from "./photo-viewer";

type TransitionMoment = "story" | "photos" | "next" | "request";

const invitations = {
  winter: "Расскажите о вашей ёлке — обсудим программу и состав праздника",
  birthday: "Расскажите об имениннике — подберём историю для его праздника",
  school: "Расскажите о вашем классе — подберём программу для детей",
  garden: "Расскажите о вашей группе — обсудим подходящую программу",
  graduation: "Давайте придумаем праздник для вашего выпускного",
  service: "Обсудим, чем дополнить ваш праздник",
  show: "Выберите историю — детали праздника обсудим вместе",
  default: "Расскажите о празднике — соберём программу под вас"
};

function themeForPath(path: string) {
  if (/novogod|novyy-god|zimoy/.test(path)) return "winter";
  if (/den-rozhdeniya/.test(path)) return "birthday";
  if (/vypuskn/.test(path)) return "graduation";
  if (/detskom-sadu|detskiy-sad/.test(path)) return "garden";
  if (/shkol|klassa|klass$/.test(path)) return "school";
  if (path.startsWith("/uslugi")) return "service";
  if (path.startsWith("/spektakli")) return "show";
  return "default";
}

export function transitionText(path: string, moment: TransitionMoment) {
  const theme = themeForPath(path);
  if (moment === "request") return invitations[theme];
  if (moment === "next") {
    if (path.startsWith("/kejsy")) return "Каким вы представляете свой праздник?";
    if (path.startsWith("/podboroki")) return "Выберем идею, которая подойдёт вашим детям";
    return "От идеи — к программе вашего праздника";
  }
  if (moment === "photos") {
    if (theme === "service") return "Яркие детали, из которых складывается праздник";
    if (theme === "winter") return "Сказочные герои, игры и новогоднее настроение";
    if (theme === "birthday") return "Приключение, в центре которого — именинник";
    if (theme === "garden") return "Приключение для всей группы";
    if (theme === "school") return "История для вашего класса";
    return "Здесь дети становятся участниками сказки";
  }
  const special: Record<string, string> = {
    "/": "Ваша идея праздника — начало нашей истории",
    "/spektakli": "Какую сказку сыграем для ваших детей?",
    "/uslugi": "Добавим к празднику яркие детали",
    "/prazdniki": "У каждого повода — своя история",
    "/tseny": "Начнём с вашей идеи и подходящего формата",
    "/o-teatre": "За каждой сказкой — люди театра",
    "/otzyvy-pressa": "Праздник продолжается в воспоминаниях",
    "/foto-video": "Моменты, которые хочется рассмотреть поближе",
    "/dlya-vzroslyh": "Праздник начинается с вашей идеи",
    "/dlya-biznesa": "Соберём программу под ваше событие"
  };
  if (special[path]) return special[path];
  if (theme === "winter") return "Пусть новогодняя сказка оживёт на вашем празднике";
  if (theme === "birthday") return "Сегодня у приключения есть свой именинник";
  if (theme === "garden") return "Одна история — приключение для всей группы";
  if (theme === "school") return "Общая история для вашего класса";
  if (theme === "graduation") return "Новая глава начинается с праздника";
  if (theme === "service") return "Выберем детали под вашу программу";
  if (theme === "show") return "У этой истории есть роли для ваших детей";
  return "Начнём с идеи вашего праздника";
}

export function TheatreSpark() {
  return <span className="theatre-spark" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M16 2 20 12 30 16 20 20 16 30 12 20 2 16 12 12Z" fill="currentColor" /><path d="M16 10v12M10 16h12" stroke="var(--paper)" strokeWidth="1.5" /></svg></span>;
}

export function SectionTransition({ path, moment = "story", photo = false }: {
  path: string;
  moment?: TransitionMoment;
  photo?: boolean;
}) {
  const text = transitionText(path, moment);
  // Only a confirmed photograph assigned to the topic, or a general theatre moment.
  const related = photosForPage(path);
  const image = photo ? (related[1] ?? related[0] ?? portfolioPhotos.find(item => item.id === (path === "/uslugi" ? 4 : path === "/prazdniki" ? 35 : 90))) : undefined;
  const viewerPhotos = image ? [image, ...related.filter(item => item.id !== image.id), ...portfolioPhotos.filter(item => [35, 65, 90].includes(item.id) && item.id !== image.id && !related.some(photo => photo.id === item.id))].slice(0, 6) : [];
  return (
    <aside className={`section-transition${image ? " section-transition-photo" : ""}`} aria-label="О вашем празднике" data-transition={moment}>
      {image && <figure>
        <PhotoOpenButton photos={viewerPhotos} index={0}>
          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 680px) calc(100vw - 64px), 390px" loading="lazy" />
        </PhotoOpenButton>
        <figcaption>{image.alt}</figcaption>
      </figure>}
      <div className="section-transition-copy"><TheatreSpark /><p>{text}</p></div>
    </aside>
  );
}
