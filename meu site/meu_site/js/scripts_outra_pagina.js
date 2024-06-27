document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('rollButton');
    const resultadoDiv = document.getElementById('resultado');
    const historicoLista = document.getElementById('historico-lista');

    rollButton.addEventListener('click', () => {
        const dadosEntrada = document.getElementById('dadosEntrada').value.trim().toLowerCase();
        const resultadoFinal = calcularResultado(dadosEntrada);

        // Atualizar resultado
        resultadoDiv.textContent = `Resultado: ${resultadoFinal.total}`;
        if (resultadoFinal.total > resultadoFinal.maximo / 2) {
            resultadoDiv.innerHTML += ' - Parabéns!';
        } else {
            resultadoDiv.innerHTML += ' - Se Fudeu!';
        }

        // Exibir alertas para resultados específicos
        if (resultadoFinal.total < resultadoFinal.maximo / 2) {
            alert('Se FUdeu');
        } else if (resultadoFinal.total === resultadoFinal.maximo) {
            alert('CARALHOOOO');
        }

        // Atualizar histórico
        atualizarHistorico(dadosEntrada, resultadoFinal.total);
    });

    function calcularResultado(dadosEntrada) {
        // Padrão para dados, como 2d20+5 ou 1d6-2
        const padraoDados = /(\d+)?d(\d+)([-+]\d+)?/g;
        let resultadoFinal = { total: 0, maximo: 0 };

        // Match para dados
        let match;
        while ((match = padraoDados.exec(dadosEntrada)) !== null) {
            const quantidade = match[1] ? parseInt(match[1]) : 1;
            const tipoDado = parseInt(match[2]);
            const modificador = match[3] ? parseInt(match[3]) : 0;

            let resultadoParcial = 0;
            let maximoParcial = 0;

            for (let i = 0; i < quantidade; i++) {
                const roll = Math.floor(Math.random() * tipoDado) + 1;
                resultadoParcial += roll;
                maximoParcial += tipoDado;
            }

            resultadoFinal.total += resultadoParcial + modificador;
            resultadoFinal.maximo += maximoParcial;
        }

        return resultadoFinal;
    }

    function atualizarHistorico(dadosEntrada, resultado) {
        const li = document.createElement('li');
        li.textContent = `${dadosEntrada} = ${resultado}`;

        // Adicionar novo item no início da lista
        historicoLista.insertBefore(li, historicoLista.firstChild);

        // Limitar histórico a 10 itens
        while (historicoLista.children.length > 10) {
            historicoLista.removeChild(historicoLista.lastChild);
        }
    }
});

// Evento para consultar a ficha ao clicar no botão
document.getElementById('consultarFicha').addEventListener('click', consultarFicha);

function consultarFicha() {
    // Verifica se há uma ficha salva no localStorage
    if (localStorage.getItem('character')) {
        const character = JSON.parse(localStorage.getItem('character'));
        const fichaOutput = document.getElementById('fichaOutput');
        fichaOutput.innerHTML = `
            <p><strong>Nome:</strong> ${character.name}</p>
            <p><strong>Classe:</strong> ${character.class}</p>
            <p><strong>Raça:</strong> ${character.race}</p>
            <p><strong>Nível:</strong> ${character.level}</p>
            <p><strong>Força:</strong> ${character.attributes.strength}</p>
            <p><strong>Destreza:</strong> ${character.attributes.dexterity}</p>
            <p><strong>Constituição:</strong> ${character.attributes.constitution}</p>
            <p><strong>Inteligência:</strong> ${character.attributes.intelligence}</p>
            <p><strong>Sabedoria:</strong> ${character.attributes.wisdom}</p>
            <p><strong>Carisma:</strong> ${character.attributes.charisma}</p>
            <p><strong>Pontos de Vida:</strong> ${character.hp}</p>
            <p><strong>Classe de Armadura:</strong> ${character.ac}</p>
        `;
        document.getElementById('fichaSection').style.display = 'block';
    } else {
        alert('Nenhuma ficha de personagem encontrada.');
    }
}
