# Pledari Grond - Frontend

The frontend applications for Pledari Grond - a comprehensive Rumantsch language dictionary and administration platform.

## Overview

This monorepo contains two Angular-based applications:

- **frontend** - Public-facing dictionary search application
- **admin** - Administration interface for dictionary management

## Prerequisites

- Node.js 22+ (compatible with pnpm)
- [pnpm](https://pnpm.io/) 10.12.4+

The project uses **pnpm** as its package manager. Install it globally if you haven't already:

```bash
npm install -g pnpm
```

Or use corepack (included with Node.js 16.13+):

```bash
corepack enable
```

### frontend

![Screenshot frontend](/imgs/frontend.png?raw=true "The frontend of the Pledari Grond")

The user facing web application that allows searching in the dictionary. The UI of this application is based on the [old version of Pledari Grond](https://github.com/plattafurma-libra/pledari-grond/tree/surmiran/maalr.gwt), but completely rewritten from scratch.

### admin

![Screenshot admin](/imgs/admin.png?raw=true "The admin section of the Pledari Grond")

The administration interface for managing dictionary content.

## Docker Deployment

The project includes Docker configurations for containerized deployment:

- **Dockerfile** - Default build (frontend + admin)
- **Dockerfile-ladin** - Ladin language variant build
