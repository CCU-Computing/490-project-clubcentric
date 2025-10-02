
---
Contributing

We welcome contributions! Please read `CONTRIBUTING.md` for guidelines, coding style, and PR process.

Typically:

1. Fork the repo
2. Create a feature branch (`feature/your-feature`)
3. Commit with clear messages
4. Open a pull request with description and link to issue
5. A maintainer will review and merge

Be sure to run tests & linters before submitting.

---
## Table of Contents

1. [Commit Extended Description Protocol](#commit-extended-description-protocol)
2. [API & Endpoints](#api-&-endpoints)
3. [Contributing Backend Code](#contributing-backend-code)
4. [Running](#running)
5. [Testing](#testing)
6. [Commit Cmd Line](#commit-cmd-line)

---
## Commit Extended description Protocol 

Like an email you should provide the adress/`Document File Location:` and `Subject:`. A directory image with `<--- [ file purpose ]` will help with quick navigation.

Below is a template of the `Extended description` to copy & paste:

```bash
Document File Location:
mywebapp/
├── README.md <--- [canonical list of sections for quick on boarding ]
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── CHANGELOG.md
├── backend/
│ ├── README.md
│ ├── src/
│ └── tests/
├── frontend/
│ ├── README.md
│ ├── src/
│ └── tests/
└── docs/
├── architecture.md
├── user-stories.md
├── deployment.md
└── api-reference.md

Subject:
If commit messsage too long.
```

---
## API & Endpoints

See `../docs/api-reference.md` for full API docs and examples.

---
## Contributing Backend Code

* Follow PEP8 style
* Use black / isort
* Write unit tests / integration tests
* Use `flake8` / `mypy` for static checks
* Create PRs against `main` branch

---
## Running

```bash
python manage.py runserver
```

---
## Testing

```bash
pytest
```

---
## Commit Cmd Line 

```bash
commit 
```

---

