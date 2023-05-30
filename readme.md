## Instructions

Para usar o projeto no `Expo` é necessário gerar a versão  `dev-client` do 
`expo` usando o comando 

```batch 
eas build --profile development --platform android
```
Ou 

```batch 
npm run build:client:simulator
```

após pasta executar o comando para iniciar o servidor

```batch 
npm run start:dev
```

para gerar a versão apk para android basta executar o comando

```batch 
npm run build:apk
```

para gerar a versão para a loja do android basta executar o comando

```batch 
npm run build:store
```


