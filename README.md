# cv.andresestupinan.dev

Personal CV site for Andrés Estupiñán, Senior AWS DevOps Engineer, Berlin.

Live at **<https://cv.andresestupinan.dev>**.

Content lives in YAML, is compiled to static HTML by a zero-framework Node build, and is
served from Cloudflare Workers Static Assets. A text-based PDF is generated from the same
source, so the machine-readable CV and the web page can never drift apart.

## Credit

This project is a derivative of
**[frostyslav/personal-cv-static-site](https://github.com/frostyslav/personal-cv-static-site)**
by **Rostyslav Fridman**, used under the MIT licence. The build pipeline, Handlebars
templates, i18n handling, accessibility test suite and PDF generation are his work.

It is kept as a standalone repository rather than a GitHub fork, with upstream wired as a
second remote so fixes can still be pulled:

```sh
git remote add upstream https://github.com/frostyslav/personal-cv-static-site.git
git fetch upstream
```

Changes here are content, styling, and a Cloudflare Workers deployment. See
[LICENSE](./LICENSE): both copyright lines are retained.

The CV _content_ was rebuilt with
**[kevin-burns/claude-skills](https://github.com/kevin-burns/claude-skills)** by
**Kevin Burns**, MIT licensed. Two skills did that work: `cv-evidence-base`, which
interrogates a career for the evidence that never reached the page and grades it against
role archetypes rather than job titles, and `cv-and-human`, which tailors the result and
checks that it survives an applicant tracking system. Most of what the YAML now says
exists because those skills asked better questions than a blank page does.

Neither skill is vendored here. They shaped the content, not the code, so this is
acknowledgement rather than a licence obligation.

## Architecture

```text
data/<locale>/*.yaml   → content (experience, skills, education, hero)
data/certifications.yaml, data/i18n.yaml → shared across locales
templates/**/*.hbs     → Handlebars templates and partials
css/*.css              → bundled by Lightning CSS
scripts/*.js           → browser modules bundled by esbuild
dist/                  → fingerprinted, minified build output
```

The build runs in two phases: a parallel phase (HTML, CSS, JS, assets) and a sequential
phase (FontAwesome subsetting, woff2 subsetting, content-hash fingerprinting, service
worker generation).

**Editing the CV means editing YAML, never HTML.** A change that requires touching a
template is a design change, not a content change.

## Development

Node 22.16.0, see `.nvmrc`.

```sh
nvm use
npm install
npm run dev        # build once, serve on localhost:3000
```

| Command             | What it does                            |
| ------------------- | --------------------------------------- |
| `npm run build`     | Full production build to `dist/`        |
| `npm run dev:watch` | Build, serve, rebuild on change         |
| `npm run lint`      | ESLint + Stylelint                      |
| `npm test`          | Build + smoke tests                     |
| `npm run test:unit` | Unit tests                              |
| `npm run test:e2e`  | Puppeteer + axe-core WCAG 2.1 AA audit  |
| `npm run test:all`  | Everything                              |
| `npm run validate`  | html-validate against `dist/index.html` |

Font subsetting needs `pyftsubset` (`pip install fonttools brotli`). Without it the build
still succeeds, using full fonts.

Commit hooks run through `uvx prek`, so install [uv](https://docs.astral.sh/uv/) or commits
will fail. Commit messages follow
[Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint.

## Deployment

GitHub Actions runs lint, build, smoke, unit and e2e tests plus HTML validation on every
push and pull request.

The deploy job lands in phase 3: it will generate the PDF and run `wrangler deploy` to push
`dist/` to Cloudflare Workers Static Assets. The custom domain is attached in the Cloudflare
dashboard rather than declared in `wrangler.jsonc`, which keeps the CI token scoped to two
Account-level permissions and means CI never touches DNS.

## Licence

MIT. See [LICENSE](./LICENSE).

CV content (text, photograph, and the generated PDF) is not covered by the MIT licence
and remains © Andrés Estupiñán.
