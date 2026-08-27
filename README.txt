HOODCRAFT — hoodcraft.pl

PLIKI
  index.html                    strona główna + zakładka Sklep
  regulamin.html                regulamin sklepu
  style.css                     style
  script.js                     zakładki, odliczanie, kopiowanie IP, animacje
  robots.txt, sitemap.xml       pod wyszukiwarki
  assets/logo.png               logo (z przezroczystością)
  assets/hero.webp / hero.jpg   tło hero (WebP domyślnie, JPG jako zapas)
  assets/og-image.jpg           miniatura linku na Discordzie i w social media
  assets/favicon.svg            ikona karty przeglądarki
  assets/apple-touch-icon.png   ikona na iOS
  assets/fonts/*.woff2          Anton + Inter hostowane u nas

PODGLĄD LOKALNIE
  Przeglądarki blokują wczytywanie fontów z protokołu file://, więc samo
  kliknięcie index.html pokaże stronę z zapasowym krojem pisma.
  Żeby zobaczyć ją tak jak w internecie, odpal w katalogu projektu:

      python -m http.server 8000

  i wejdź na http://localhost:8000

PUBLIKACJA NA HOODCRAFT.PL
  home.pl działa na panelu Plesk, w którym katalogiem strony jest
  httpdocs (nie public_html).

  panel.home.pl -> "Pliki" w menu z lewej -> wybierz hoodcraft.pl
  (albo: "WWW domeny" -> przycisk "Menedżer plików")
  -> wejdź do katalogu httpdocs

  Najszybciej: wgraj tam całą paczkę ZIP przyciskiem "Wgraj",
  zaznacz ją i użyj "Wypakuj", a potem skasuj sam plik ZIP.

  index.html musi wylądować bezpośrednio w httpdocs, a nie
  w podkatalogu. Folder assets musi zostać folderem assets —
  ścieżki do plików są względne.

  Jeśli w Twoim pakiecie katalog nazywa się inaczej (public_html
  albo www), obowiązuje ta sama zasada: pliki idą do tego katalogu,
  który panel wskazuje jako katalog strony WWW.

CO GDZIE ZMIENIĆ

  Hasło w hero
      index.html -> <h1 class="hero-title cut">
      Tekst wpisujesz TYLKO w pierwszej kopii (tej z atrybutem
      data-cut-source) — script.js przepisze go do pozostałych
      warstw cięcia. Najlepiej wygląda hasło w dwóch liniach
      o zbliżonej długości.

  Cięcie mieczem
      style.css -> sekcja ".cut" i ".cut__half"
        --cut-angle   nachylenie linii cięcia (domyślnie 11 stopni)
        --shift-x     rozsunięcie połówek w poziomie
        --shift-y     rozsunięcie połówek w pionie
        --kerf        szerokość rozżarzonej rany na krawędzi
      Kolory: .cut__half--top (srebro nad cięciem)
              .cut__half--bot (czerwień pod cięciem)
      Uwaga: --shift-* i --kerf muszą zostać w regule .cut__half,
      bo są w jednostkach "em" i liczą się od wielkości napisu.

  Data i godzina startu
      index.html -> <div class="countdown" data-deadline="...">
      Format: 2026-08-28T18:00:00+02:00
      Po przekroczeniu terminu licznik sam zamienia się w komunikat
      "SERWER WYSTARTOWAŁ".

  IP serwera
      index.html -> <button class="ip-copy" data-copy="hoodcraft.pl">
      Zmieniasz w data-copy ORAZ w widocznym <strong>.

  Wersja gry / tryb
      index.html -> <p class="server-strip"> oraz sekcja FAQ.

  Przedmiot wielokrotnego użytku
      Dopisz do karty klasę "item-card--reuse" i na końcu karty:
      <span class="item-reuse">Wielokrotnego użytku — ...</span>
      Karta dostaje wtedy srebrną ramkę zamiast czerwonej, żeby
      od razu odróżniała się od jednorazówek.

  Discord
      index.html -> wyszukaj "discord.gg/hoodcraft"

  Uruchomienie sklepu (ItemShopSys)
      script.js -> na samej górze pliku:
          var SHOP_URL = '';
      Puste = zakładka Sklep pokazuje "SKLEP WKRÓTCE".
      Po wpisaniu adresu sklepu, np.
          var SHOP_URL = 'https://hoodcraft.myis.pl';
      zakładka sama przechodzi w tryb sprzedaży: nagłówek
      "SKLEP OTWARTY", przycisk "Przejdź do sklepu" i etykiety
      kart "W SPRZEDAŻY". To jedyna linijka do zmiany.
      Po podpięciu własnej domeny w panelu ItemShopSys wpisujesz
      tam po prostu https://sklep.hoodcraft.pl

  Regulamin
      regulamin.html
      Regulamin napisany jest pod DZIAŁALNOŚĆ NIEREJESTROWANĄ:
      bez NIP i REGON, bo nie ma wpisu do CEIDG.
      Pola wyróżnione na czerwono (klasa "fill") MUSZĄ zostać
      uzupełnione przed publikacją — zostały cztery:
      imię i nazwisko, adres, e-mail do reklamacji, data.
      Po zarejestrowaniu działalności gospodarczej podmień
      punkt 1.1 wg komentarza, który jest w pliku obok niego.
      Sprzedawcą jesteś Ty (Usługodawca z punktu 1.1), a SimPay
      jest tylko operatorem płatności — nie zmieniaj tego paragrafu
      bez sprawdzenia umowy z operatorem.

DISCORD
  https://discord.gg/hoodcraft
