# Pokédex API

## Description

This is a simple API that allows you to get information about pokemons. Its data is obtained from the [PokemonDb](https://pokemondb.net/pokedex/national).

## Running locally

Before you start to run the API locally, you should have a AWS account, an IAM user and the AWS CLI installed on your machine. Here are the steps to get this done if you don't have it already:

- [Create an AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
- [Create an IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)
- [Configure the AWS CLI](https://sst.dev/chapters/configure-the-aws-cli.html)

Then, you need to have [Node.js](https://nodejs.org/en/) and [pnpm](https://pnpm.io) installed on your machine. If you don't have pnpm, you can installed using npm:

```bash
npm install -g pnpm
```

Then, you can clone this repository and run the following commands:

```bash
pnpm install
```

Once you have all the package dependencies installed, you can run the API with the following command:

```bash
npm dev
```

You may be prompted to enter a personal stage name. You can enter any name you want, such as:

```bash
## Please enter a name you’d like to use for your personal stage. Or hit enter to use dev:
dev
```

Once you enter the name, the SST framework will deploy the API to your AWS account. You can check the progress of the deployment in the terminal. Once the deployment is done, you should see a message like this:

```bash
✔  Deployed:
   API
   ApiEndpoint: https://xknbm8zem2.execute-api.us-east-1.amazonaws.com

✔  Built
```
