document.addEventListener("DOMContentLoaded", () => {
    const players = JSON.parse(sessionStorage.getItem('players')) || [];
    let round = parseInt(sessionStorage.getItem('round')) || 1;

    const home = document.getElementById('home');
    const addPlayers = document.getElementById('addPlayers');
    const game = document.getElementById('game');
    const playerList = document.getElementById('playerList');
    const playerScores = document.getElementById('playerScores');
    const currentRound = document.getElementById('currentRound');
    const roundObjective = document.getElementById('roundObjective');
    const podiumSection = document.getElementById('podium');
    const top3 = document.getElementById('top3');
    const restOfPlayers = document.getElementById('restOfPlayers');

    const roundObjectives = [
        "6 cartas: 2 tríos",
        "7 cartas: 1 trío y 1 escalera",
        "8 cartas: 2 escaleras",
        "9 cartas: 3 tríos",
        "10 cartas: 2 tríos y 1 escalera",
        "11 cartas: 2 escaleras y 1 trío",
        "12 cartas: 3 escaleras"
    ];

    const showSection = (section) => {
        home.classList.add('d-none');
        addPlayers.classList.add('d-none');
        game.classList.add('d-none');
        podiumSection.classList.add('d-none');
        section.classList.remove('d-none');
    };

    const updateScores = () => {
        playerScores.innerHTML = '';
        players.forEach((player, index) => {
            playerScores.innerHTML += `
                <tr>
                    <td>${player.name}</td>
                    <td id="score-${index}">${player.score}</td>
                    <td>
                        <div style='display:flex; padding:5px;'>
                            <input type="number" class="form-control" id="addPoints-${index}" placeholder="0">
                            <button class="btn btn-sm btn-success mt-2" onclick="addPoints(${index})">Añadir</button>
                        </div>
                    </td>
                </tr>
            `;
        });
    };

    window.addPoints = (index) => {
        const points = parseInt(document.getElementById(`addPoints-${index}`).value, 10);
        if (!isNaN(points)) {
            players[index].score += points;
            sessionStorage.setItem('players', JSON.stringify(players));
            updateScores();
        }
    };

    document.getElementById('startGame').addEventListener('click', () => showSection(addPlayers));

    document.getElementById('addPlayer').addEventListener('click', () => {
        const playerName = document.getElementById('playerName').value.trim();
        if (playerName) {
            if (players.find(player => player.name === playerName)) {
                alert('El jugador ya existe');
                return;
            }
            players.push({ name: playerName, score: 0 });
            sessionStorage.setItem('players', JSON.stringify(players));
            playerList.innerHTML += `<li class="list-group-item participantes">${playerName}</li>`;
            document.getElementById('playerName').value = '';
            document.getElementById('startRound').disabled = false;
        }
    });

    document.getElementById('startRound').addEventListener('click', () => {
        showSection(game);
        updateScores();
    });

    document.getElementById('nextRound').addEventListener('click', () => {
        if (round >= roundObjectives.length) {
            nextRoundButton.disabled = true;
            nextRoundButton.style.display = 'none';
            endGame();
        } else {
            round++;
            sessionStorage.setItem('round', round);
            currentRound.textContent = round;
            roundObjective.textContent = roundObjectives[round - 1] || "Fin del juego";
        }
    });
    document.getElementById('endGame').addEventListener('click', () => {
        // Ordenamos a los jugadores por puntuación de mayor a menor
        players.sort((a, b) => a.score - b.score);

        // Mostrar el podio
        let podiumHTML = `
        <div style="max-width: 80%; background-color: rgb(179, 212, 224); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <div class="row">
                <div class="col-4 text-center" style='margin-top: 50px;'>
                <h4 class=".text-secondary" style='font-weight: bold;'>🥈 <br> ${players[1].name} - ${players[1].score} puntos</h4>
                </div>
                <div class="col-4 text-center">
                    <h4 class="text-warning" style='font-weight: bold;'>🥇 <br> ${players[0].name} - ${players[0].score} puntos</h4>
                </div>
                <div class="col-4 text-center" style='margin-top: 50px;'>
                    <h4 class="text-danger" style='font-weight: bold;'>🥉 <br> ${players[2].name} - ${players[2].score} puntos</h4>
                </div>
            </div>
        </div>
        `;
        top3.innerHTML = podiumHTML;

        // Mostrar el resto de los jugadores
        let restOfPlayersHTML = '';
        players.slice(3).forEach((player, index) => {
            restOfPlayersHTML += `<li class="list-group-item" style='font-weight: bold; background-color: rgb(179, 212, 224);'>${index + 4}º: ${player.name} - ${player.score} puntos</li>`;
        });

        // Si no hay jugadores más allá del tercero, no mostrar el listado
        if (restOfPlayersHTML === '') {
            restOfPlayers.innerHTML = '<li class="list-group-item">No hay más jugadores.</li>';
        } else {
            restOfPlayers.innerHTML = restOfPlayersHTML;
        }

        // Mostrar el podio en la página
        showSection(podiumSection);
    });

    document.getElementById('restartGame').addEventListener('click', () => {
        sessionStorage.clear();
        showSection(home);
    });

    if (players.length) {
        updateScores();
        showSection(game);
    } else {
        showSection(home);
    }
});
