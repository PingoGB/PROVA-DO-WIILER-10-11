let listaDeSolicitantes = [];

async function carregarSolicitante() {
  listaDeSolicitantes = await chamarServidor('http://localhost:3000/solicitante');
  document.getElementById('tabela').innerHTML = listaDeSolicitantes.map(solicitante => `
    <tr>
      <td>${solicitante.nome}</td>
      <td>${solicitante.email}</td>
      <td>${solicitante.telefone}</td>
      <td>
        <button onclick="preencherFormularioDeSolicitante(${solicitante.id})">Editar</button>
        <button onclick="excluirSolicitante(${solicitante.id})">Excluir</button>
      </td>
    </tr>
  `).join('');
}

function limparFormularioDeSolicitante() {
  document.getElementById('formulario').reset();
  document.getElementById('idDoRegistro').value = '';
}

function preencherFormularioDeSolicitante(idDoSolicitante) {
  const solicitante = listaDeSolicitantes.find(solicitanteDaLista => solicitanteDaLista.id == idDoSolicitante);
  document.getElementById('idDoRegistro').value = solicitante.id;
  document.getElementById('nome').value = solicitante.nome;
  document.getElementById('email').value = solicitante.email;
  document.getElementById('telefone').value = solicitante.telefone;
}

async function excluirSolicitante(idDoSolicitante) {
  await chamarServidor('http://localhost:3000/solicitante/' + idDoSolicitante, 'DELETE');
  carregarSolicitante();
}

document.getElementById('formulario').onsubmit = async (evento) => {
  evento.preventDefault();
  const idDoRegistro = document.getElementById('idDoRegistro').value;
  const dadosDoSolicitante = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
  };

  if (idDoRegistro) await chamarServidor('http://localhost:3000/telefone/' + idDoRegistro, 'PUT', dadosDoSolicitante);
  else await chamarServidor('http://localhost:3000/solicitante', 'POST', dadosDoSolicitante);
  limparFormularioDeSolicitante();
  carregarSolicitante();
};

carregarSolicitante();