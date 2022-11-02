// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract TodoContract {
    event AddToDo(address reciever, uint256 todoId);
    event DeleteToDo(uint256 todoId, bool isDeleted);

    struct Todo {
        uint256 id;
        string desc;
        bool isDeleted;
    }
    Todo[] private todos;

    mapping(uint256 => address) todoMem;

    function addTodo(string memory todoText, bool isDeleted) external {
        uint256 todoId = todos.length;
        todos.push(Todo(todoId, todoText, isDeleted));
        todoMem[todoId] = msg.sender;
        emit AddToDo(msg.sender, todoId);
    }

    function getMyTodos() external view returns (Todo[] memory) {
        Todo[] memory temporary = new Todo[](todos.length);
        uint counter = 0;
        for(uint i=0; i<todos.length; i++) {
            if(todoMem[i] == msg.sender && todos[i].isDeleted == false) {
                temporary[counter] = todos[i];
                counter++;
            }
        }

        Todo[] memory result = new Todo[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    // Method to Delete a Tweet
    function deletTodo(uint todoId, bool isDeleted) external {
        
        if(todoMem[todoId] == msg.sender) {
            todos[todoId].isDeleted = isDeleted;
            emit DeleteToDo(todoId, isDeleted);
        }
    }
}
