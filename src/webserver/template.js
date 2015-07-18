export default function template(title, content, state) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${title}</title>
    <link rel="stylesheet" href="/frontend.css" />
  </head>
  <body>
    <div id="app">${content}</div>
    <script>
      window.state = ${JSON.stringify(state)}
    </script>
    <script src="/frontend.js" async></script>
  </body>
</html>
`
}
