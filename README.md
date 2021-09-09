# Jeepunii

__Before Proceeding:__

Knowledge on how to change directories on the terminal is assumed.
See '**`cd` or change directory**' topic on this [tutorial](https://tutorials.codebar.io/command-line/introduction/tutorial.html). Then proceed to setup.

## Requirements

- Git
- Docker
- Docker Compose

## Setup

Clone the repository

```sh
git clone https://github.com/avidianity/jeepunii.git
```

---

Make sure you have `yarn` installed on your system.

Installing yarn if you haven't yet:

```sh
npm install -g yarn
```

To confirm if `yarn` is installed. Type:

```sh
yarn --version
```

---

## Installing Dependencies

**Note**: If docker is used, exclude `server` from installation and skip to [running](#running) after finishing `mobile` and `web` setup.

On each module (`mobile`, `server` (exclude if using docker), `web`) run:

```sh
yarn
```

This will install any dependency that each module needs.

---

## Setup Environment Variables

### Web

- Copy `.env.example` to a new `.env` file.

### Mobile

- Copy `localconfig.example.json` to a new `localconfig.json` file and adjust `dev` value `address` to the correct IP Address of your system.

### Server

With Docker:

Nothing to do

---

Without Docker:

- Copy `.env.example` to a new `.env` file.
- `LOCATION_IQ_TOKEN` can be acquired by signing up for a free tier account at [LocationIQ](https://locationiq.com/). This is used by the server internally to improve location searching capabilities.
- Setup database credentials
- Put `KEY` (it can be any combination of letters and numbers)

---

## Running

### Mobile and Web

```sh
yarn start
```

### Server

With docker:

```sh
docker-compose up -d --build
```

---

Without docker:

```sh
yarn start:dev
```
