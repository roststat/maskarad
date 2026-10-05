import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Тест палитры «Маскарада»",
  robots: { index: false, follow: false }
};

export default function PaletteTestPage() {
  return (
    <main className="palette-test">
      <section className="palette-hero">
        <span className="palette-curtain palette-curtain-left" />
        <span className="palette-curtain palette-curtain-right" />
        <div className="palette-content">
          <span className="palette-kicker">Тест визуального направления</span>
          <Image
            className="palette-logo"
            src="/images/legacy/maskarad-logo-test.png"
            alt="Тестовый вариант логотипа театра Маскарад"
            width={1086}
            height={362}
            priority
          />
          <h1>Театральная палитра старого «Маскарада» — в современном интерфейсе</h1>
          <p>Глубокий сценический синий, красный акцент маски, теплое золото занавеса и светлый фон для понятного выбора программы.</p>
          <div className="palette-actions">
            <Link href="/" className="palette-button palette-button-main">На главную</Link>
            <Link href="/spektakli" className="palette-button palette-button-light">Смотреть спектакли</Link>
          </div>
        </div>
      </section>

      <section className="palette-notes">
        <div>
          <span className="palette-dot palette-blue" />
          <strong>Сценический синий</strong>
          <p>Основной цвет шапки, фона и спокойных блоков.</p>
        </div>
        <div>
          <span className="palette-dot palette-red" />
          <strong>Красный маски</strong>
          <p>Цвет действия: заявка, важные акценты и навигация.</p>
        </div>
        <div>
          <span className="palette-dot palette-gold" />
          <strong>Золото занавеса</strong>
          <p>Небольшой теплый акцент для театрального характера.</p>
        </div>
      </section>
    </main>
  );
}
