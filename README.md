# Orel Codes stats

Все приложение можно запустить с помощью [Docker](https://docs.docker.com/install/) и [docker-compose](https://docs.docker.com/compose/).

При первом запуске контейнеров будут установлены зависимости.

Предварительно нужно скачать данные чата из Телеграма. Например [здесь](https://winaero.com/blog/export-chat-history-file-telegram-desktop/) можно посмотреть как это сделать.
Положить результат экспорта нужно в папку chat-data.

Дальше можно запускать приложение

```bash
docker-compose up
```

После успешной устновки всех зависимостей и запуска всех контейнеров можно загрузить данные в БД

```bash
docker-compose exec server bash /import-data/run.sh
```

Если все правильно, то в браузере у вас должно быть доступно приложение по адресу [http://localhost:4200](http://localhost:4200).