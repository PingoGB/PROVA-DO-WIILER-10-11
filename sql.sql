CREATE TABLE usuario (
id SERIAL PRIMARY KEY,
nome VARCHAR(255) not null,
email VARCHAR(255) unique not null,
senha VARCHAR(255) not null
);

CREATE TABLE solicitante (
id SERIAL PRIMARY KEY,
nome VARCHAR(255) not null,
email VARCHAR(255) unique not null,
telefone VARCHAR(255) unique not null
);

CREATE TABLE chamado(
id SERIAL PRIMARY KEY,
servico VARCHAR(255) not null,
data_chamado date not null,
id_solicitante INT,

foreign key (id_solicitante) REFERENCES solicitante (id)
)