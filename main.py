from js import document
from pyodide.ffi import create_proxy
from random import randint
import itertools
import copy

initial_state = [['-','-','-'],
                ['-','-','-'],
                ['-','-','-']]


def get_available_indexes(game_state):
        available = []
        for y, row in enumerate(game_state):
            for x, cell in enumerate(row):
                if cell == '-':
                    available.append({'x': x, 'y': y})
        return available

def is_game_ended(game_state):
        char_x = 'X'
        char_o = 'O'

        if ((game_state[0][0]==char_x and game_state[0][1]==char_x and game_state[0][2]==char_x) or
            (game_state[1][0]==char_x and game_state[1][1]==char_x and game_state[1][2]==char_x) or
            (game_state[2][0]==char_x and game_state[2][1]==char_x and game_state[2][2]==char_x )or
            (game_state[0][0]==char_x and game_state[1][0]==char_x and game_state[2][0]==char_x) or
            (game_state[0][1]==char_x and game_state[1][1]==char_x and game_state[2][1]==char_x) or
            (game_state[0][2]==char_x and game_state[1][2]==char_x and game_state[2][2]==char_x) or
            (game_state[0][0]==char_x and game_state[1][1]==char_x and game_state[2][2]==char_x) or
            (game_state[0][2]==char_x and game_state[1][1]==char_x and game_state[2][0]==char_x)):
            return True, 'player'
        elif ((game_state[0][0]==char_o and game_state[0][1]==char_o and game_state[0][2]==char_o) or
            (game_state[1][0]==char_o and game_state[1][1]==char_o and game_state[1][2]==char_o) or
            (game_state[2][0]==char_o and game_state[2][1]==char_o and game_state[2][2]==char_o )or
            (game_state[0][0]==char_o and game_state[1][0]==char_o and game_state[2][0]==char_o) or
            (game_state[0][1]==char_o and game_state[1][1]==char_o and game_state[2][1]==char_o) or
            (game_state[0][2]==char_o and game_state[1][2]==char_o and game_state[2][2]==char_o) or
            (game_state[0][0]==char_o and game_state[1][1]==char_o and game_state[2][2]==char_o) or
            (game_state[0][2]==char_o and game_state[1][1]==char_o and game_state[2][0]==char_o)):
            return True, 'ai'
        else:
            return False, ''

def minimax(board, last_move_player, depth=1):
    available_moves = get_available_indexes(board)
    # Evaluate terminal nodes
    game_ended, winner = is_game_ended(board)
    if game_ended:
        if winner == "player":
            return {'score': -10 - 10/depth}
        else:
            return {'score': 10 + 10/depth}
    elif len(available_moves) == 0:
        return {'score': 0}

    # Evaluate posible moves
    moves = []
    for move in available_moves:
        move_data = {}
        if last_move_player:
            board[move['y']][move['x']] = 'O'
        else:
            board[move['y']][move['x']] = 'X'

        move_data['indexes'] = move
        new_depth = depth + 1
        move_data['score'] = minimax(board, not last_move_player, new_depth)['score']

        board[move['y']][move['x']] = '-'
        moves.append(move_data)

    if last_move_player:
        bestMove = max(moves, key=lambda x: x['score'])
    else:
        bestMove = min(moves, key=lambda x: x['score'])

    return bestMove

class TicTacToeGame():
    def __init__(self):
        #Initialize variables
        self.player_turn = True
        self.game_end = False
        self.winner = ''
        self.game_state = copy.deepcopy(initial_state)
        
        #Link functions to html elements
        self.on_cell_click_proxy = create_proxy(self.on_cell_click)
        cells = document.getElementsByTagName('td')
        for cell in cells:
            cell.addEventListener("click", self.on_cell_click_proxy)

        self.restart_game_ai_start_proxy = create_proxy(self.restart_game_ai_start)
        self.restart_game_player_start_proxy = create_proxy(self.restart_game_player_start)
        ai_start_btn = document.getElementById('restart-pc')
        player_start_btn = document.getElementById('restart-you')
        ai_start_btn.addEventListener("click", self.restart_game_ai_start_proxy)
        player_start_btn.addEventListener("click", self.restart_game_player_start_proxy)

    def on_cell_click(self, pointerEventObj):
        dom_elem = pointerEventObj.currentTarget
        if(self.player_turn and not self.game_end and len(get_available_indexes(self.game_state))>0):
            rowIndex = dom_elem.parentNode.rowIndex
            cellIndex = dom_elem.cellIndex

            if self.game_state[rowIndex][cellIndex] != '-':
                return
            
            self.game_state[rowIndex][cellIndex] = 'X'
            self.player_turn = False
            self.update_turn_text()
            self.update_board()

            self.game_end, self.winner = is_game_ended(self.game_state)
            self.update_win_text()

            #Run AI
            self.run_ai()

    def restart_game(self, player_start):
        # Clear game
        self.game_state = copy.deepcopy(initial_state)
        cells = document.getElementsByTagName('td')
        for cell in cells:
            cell.innerHtml = '&nbsp;'
        
        # Set initial variables
        self.player_turn = player_start
        self.game_end = False
        self.winner = ''

        # If AI start perform random move
        self.update_turn_text()

        if not player_start:
            x = randint(0,2)
            y = randint(0,2)
            self.game_state[y][x] = 'O'
            self.player_turn = True

        # Update HTML
        self.update_turn_text()
        self.update_board()
    
    def restart_game_ai_start(self, pointerEventObj):
        self.restart_game(False)
    
    def restart_game_player_start(self, pointerEventObj):
        self.restart_game(True)
    
    def run_ai(self):
        if not self.game_end and len(get_available_indexes(self.game_state))>0:
            move = minimax(self.game_state, True)
            y = move['indexes']['y']
            x = move['indexes']['x']
            self.game_state[y][x] = 'O'
            self.player_turn=True

            self.update_turn_text()
            self.update_board()
            self.game_end, self.winner = is_game_ended(self.game_state)
            self.update_win_text()

    def update_turn_text(self):
        turn_text = document.getElementById("turn")
        if self.player_turn:
            turn_text.innerHTML = 'Current turn: You'
        else:
            turn_text.innerHTML = 'Current turn: AI'
    
    def update_win_text(self):
        turn_text = document.getElementById("turn")
        if self.game_end:
            if self.winner == 'player':
                turn_text.innerHTML = 'You won'
            else:
                turn_text.innerHTML = 'AI won'
        elif len(get_available_indexes(self.game_state))==0:
            turn_text.innerHTML = 'Tie!'
    
    def update_board(self):
        flat_board = self.game_state[0]+self.game_state[1]+self.game_state[2]
        cells = document.getElementsByTagName('td')
        for idx, cell in enumerate(cells):
            if flat_board[idx] == '-':
                cell.innerHTML = '&nbsp;'
            else:
                cell.innerHTML = flat_board[idx]

    def shutdown(self):
        self.on_cell_click_proxy.destroy()


game = TicTacToeGame()