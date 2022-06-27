# Lazy plugins - загрузка плагинов по требованию

## Введение
Скрипт предназначен для того, чтобы загружать только те плагины, которые используются на странице.

## Симптом

### Что видим в шаблоне

```html
<script src="./js/jquery.js"></script>
<script src="./js/slider.js"></script>
<script src="./js/ui.js"></script>
<script src="./js/popup.js"></script>
<script src="./js/scroll.js"></script>
<script src="./js/datepicker.js"></script>
<script src="./js/slider2.js"></script>
<script src="./js/select.js"></script>
```

### Что видим в теле
```html
<p>Я текстовая страница со слайдером</p>
<div id="slider">
    <img src="some.jpg">
    <img src="some1.jpg">
    <img src="some2.jpg">
</div>
<script>
    $('#slider').slider();
</script>
```

На данной странице мы используем только один плагин, но загружаются и инициализируются **все** плагины.

## Лечение

### Подключаем скрипт.
```html
<script src="igwd.lazyplugin.min.js"></script>
```
или
```html
<script>
    class owLazyPlugin{compress code............
</script>
```

### Инициализируем и составляем карту подключений

Добавляем в подвал сайта.
```html
<script>
    const lazyPluginMap = new owLazyPlugin({
        'gcaptcha': {
            'src': 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit',
            'selectors': [
                '.re-capthcha-block'
            ]
        },
        'select': {
            'src': './js/select.js',
            'selectors': [
                '#select',
                '.selectMain'
            ]
        }
    }, true);

    lazyPluginMap.init();
</script>
```

### Конструктор

Конструктор принимает 2 параметра: (map - object, debug - bool)

Структура объекта map:
```json
'select': { // id плагина
    'src': './js/select.js', // путь к плагину
    'selectors': [ // список селекторов, на которых инициализируется плагин
        '#select',
        '.selectMain'
    ]
}
```

### Изменение инициализации плагинов

После срабатывания метода init(), скрипт ищет в DOM селекторы, если находит, то загружает необходимый плагин. После загрузки плагина создается событие "onload-plugin-pluginId"

Соответственно, нам необходимо изменить место инициализации плагина.
```js
document.addEventListener("onload-plugin-slider", function() {
    $('#slider').slider();
});
```

## Итоговый вид
```html
<html>
    <head>
        <script src="./js/jquery.js"></script>
        <script src="./js/igwd.lazyplugin.min.js"></script>
    </head>
    <body>
        <p>Я текстовая страница со слайдером</p>
        <div id="slider">
            <img src="some.jpg">
            <img src="some1.jpg">
            <img src="some2.jpg">
        </div>
        <script>
            document.addEventListener("onload-plugin-slider", function() {
                $('#slider').slider();
            });
        </script>
    
        <footer>Some blocks</footer>

        <script>
            const lazyPluginMap = new owLazyPlugin({
                'select': {
                    'src': './js/select.js',
                    'selectors': [
                        '#select',
                        '.selectMain'
                    ]
                }
            });

            lazyPluginMap.init();
        </script>
    </body>
</html>
```