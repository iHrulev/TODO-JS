(function() {
    let listArray = [],
        listName = ''
    // создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control', 'col');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        button.disabled = true;
        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        // <from class="input-group mb-3">
        //   <input class="from-control" placeholder="Введите нозвание новго дела">
        //   <div class="input-group-append">
        //      <button class="btn btn-primary"> Добавить дело </button>
        //   </div>
        // </from>

        input.addEventListener('input', function() {
            if (input.value !== '') {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })

        return {
            form,
            input,
            button,
        };
    }

    function createTodoItem(obj) {
        let item = document.createElement('li');
        //кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а также для размещения кнопок
        // в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if (obj.done === true) item.classList.add('list-group-item-success')

        // добавляем обработчики кнопоки
        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success')

            for (const listItem of listArray) {
                if (listItem.id === obj.id) listItem.done = !listItem.done
            }
            saveList(listArray, listName)
        });
        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                item.remove();

                for (let i=0; i<listArray.length; i++) {
                    if (listArray[i].id === obj.id) listArray.splice(i,1)
                }
                saveList(listArray, listName)
            }
        })

        // вкладываем кнопки в отдельный элемент, чтобы они обьединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    // создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function getNewID(arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) max = item.id
        }
        return max + 1;
    }

    function saveList(arr, keyName) {
        localStorage.setItem(keyName ,JSON.stringify(arr));
    }

    function createTodoApp(container, title = 'Список дел', keyName, defArray = []) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        listName = keyName;
        listArray = defArray;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);


        let localData = localStorage.getItem(listName)

        if (localData != null && localData !== '') listArray = JSON.parse(localData)

        for (const itemList of listArray) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }


        // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function (e) {
            // эта строчка необходима, чтобы предотвратить стандартное действие браузера
            // в данном случае мы не хоти, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            // игнорируем создание элеента, если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value) {
                return;
            }

            let newItem = {
                id: getNewID(listArray),
                name: todoItemForm.input.value,
                done: false
            }

            let todoItem = createTodoItem(newItem);

            listArray.push(newItem);

            saveList(listArray, listName)

            // создаем и добавляем в список нвое дело с названием из поля для ввода
            todoList.append(todoItem.item);

            todoItemForm.button.disabled = true;
            // обнуляем значение в поле, чтобы не пришлось стирать его в ручную
            todoItemForm.input.value = '';
        })
    }


    window.createTodoApp = createTodoApp;
})();