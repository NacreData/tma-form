# React + Vite

setup steps:

```
nvm list-remote 
(update to latest LTS if needed)
npm create vite@latest tma-form -- --template react
cd tma-form
npm i @chakra-ui/react @emotion/react
npx @chakra-ui/cli snippet add
git init
```

The following script, run after building a production version (npm run build) makes it possible to host this code in a sub-directory. The thought is that we will make a new directory for each response. 

```
post-build.sh
```
