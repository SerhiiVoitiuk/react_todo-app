/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import className from 'classnames';
import { TaskType } from '../../types/TaskType';
import { TodosContext } from '../TodoContext/TodoContext';

type Props = {
  todo: TaskType,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const { addTodo } = useContext(TodosContext);
  const [isEditable, setIsEditable] = useState(false);
  const [editedTodo, setEditedTodo] = useState(title);

  const fieldTitle = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (fieldTitle.current && isEditable) {
      fieldTitle.current.focus();
    }
  }, [isEditable]);

  const handleChangeStatus = () => {
    addTodo(currentTodos => (
      currentTodos.map(currentTodo => (
        currentTodo.id === id
          ? {
            ...currentTodo,
            completed: !currentTodo.completed,
          }
          : currentTodo
      ))
    ));
  };

  const handleRemoveTodo = () => {
    addTodo(currentTodos => (
      currentTodos.filter(curTodo => curTodo.id !== id)
    ));
  };

  const handleChangeTitleTodo = (
    event:React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedTodo(event.target.value);
  };

  const saveChanges = () => {
    addTodo(currentTodos => (
      currentTodos.map(currTodo => (
        currTodo.id === id
          ? {
            ...currTodo,
            title: editedTodo,
          }
          : currTodo
      ))
    ));

    setIsEditable(false);
  };

  const handleKeyboardAction = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTodo(title);
      setIsEditable(false);
    }

    if (event.key === 'Enter') {
      if (editedTodo.trim().length) {
        saveChanges();
      } else {
        handleRemoveTodo();
      }
    }
  };

  return (
    <li className={className({
      completed: todo.completed,
      editing: isEditable,
    })}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          id="toggle-view"
          checked={completed}
          onChange={handleChangeStatus}
        />
        <label
          onDoubleClick={() => setIsEditable(true)}
        >
          {title}
        </label>
        <button
          type="button"
          className="destroy"
          data-cy="deleteTodo"
          onClick={handleRemoveTodo}
        />
      </div>
      <input
        type="text"
        className="edit"
        ref={fieldTitle}
        value={editedTodo}
        onChange={handleChangeTitleTodo}
        onKeyUp={handleKeyboardAction}
        onBlur={saveChanges}
      />
    </li>
  );
};
