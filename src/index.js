import './style.css';

/* ----- spa init module --- */
const mySPA = (function () {

    /* ------- begin view -------- */
    function ModuleView() {
        let myModuleContainer = null;
        let menu = null;
        let contentContainer = null;
        let rows = null;
        let colls = null;
        let arr = null;
        let matched = []
        let above = []
        this.playfield = null;

        const HomeComponent = {
            id: "main",
            title: "Главная страница примера SPA",
            render: (className = "container") => {
                return `
          <section class="${className}">
            <h1>Главная</h1>
            <p>Здесь будет контент <strong>Главной</strong> страницы.</p>
          </section>
        `;
            }
        };

        const RulesComponent = {
            id: "rules",
            title: "Правила игры",
            render: (className = "container") => {
                return `
          <section class="${className}">
            <h1>Правила</h1>
            <p>Правила игры</p>
          </section>
        `;
            }
        };

        const LevelsComponent = {
            id: "levels",
            title: "Уровни",
            render: (className = "container") => {
                return `
          <section class="${className}">
            <h1>Уровни</h1>
            <p>Выбор уровня игры</p>
         <div class="levelIcons">
            <a class="levelIcon" href="#first_level">1</a>
            <a class="levelIcon" href="#second_level">2</a>
            <a class="levelIcon" href="#third_level">3</a>
            </div>
          </section>
        `;
            }
        };

        const SignUpComponent = {
            id: "sign_up",
            title: "Регистрация",
            render: (className = "container") => {
                return `
          <section class="${className}">
            <h1>Регистрация</h1>
            <p>Зарегайся</p>
          </section>
        `;
            }
        };

        const LogInComponent = {
            id: "log_in",
            title: "Вход",
            render: (className = "container") => {
                return `
          <section class="${className}">
            <h1>Вход</h1>
            <p>Войти</p>
          </section>
        `;
            }
        };

        const ErrorComponent = {
            id: "error",
            title: "Achtung, warning, kujdes, attenzione, pozornost...",
            render: (className = "container") => {
                return `
          <section class="${className}">
            <h1>Ошибка 404</h1>
            <p>Страница не найдена, попробуйте вернуться на <a href="#main">главную</a>.</p>
          </section>
        `;
            }
        };


        this.createLevel = function (id, title, content) {
            return {
                id,
                title,
                render: (className = "container") => {
                    return `
                        <section class="${className}">
                        <p>${content}</p>
                        <div class='playfield'></div>
                        </section>`;
                }
            };
        }

        const firstLevel = this.createLevel(1, "1_level", "первый лвл")
        const secondLevel = this.createLevel(2, "2_level", "второй лвл")
        const thirdLevel = this.createLevel(3, "3_level", "третий лвл")

        const router = {
            main: HomeComponent,
            rules: RulesComponent,
            levels: LevelsComponent,
            default: HomeComponent,
            sign_up: SignUpComponent,
            log_in: LogInComponent,
            error: ErrorComponent,
            first_level: firstLevel,
            second_level: secondLevel,
            third_level: thirdLevel,
        };

        this.init = function (container) {
            myModuleContainer = container;
            menu = myModuleContainer.querySelector("#mainmenu");
            contentContainer = myModuleContainer.querySelector("#content");
        }

        this.updateButtons = function (currentPage) {
            const menuLinks = menu.querySelectorAll(".mainmenu__link");
            const state = `#${currentPage}`;

            for (let link of menuLinks) {
                state === link.getAttribute("href") ? link.classList.add("active") : link.classList.remove("active");
            }

        }

        this.renderContent = function (hashPageName) {
            let routeName = "default";

            if (hashPageName.length > 0) {
                routeName = hashPageName in router ? hashPageName : "error";
            }

            window.document.title = router[routeName].title;
            contentContainer.innerHTML = router[routeName].render(`${routeName}-page`);
            this.updateButtons(router[routeName].id);
        }

        this.getElementByOrder = function (order) { // возвращает элемент с указанным порядковым номером
            return Array.from(document.querySelectorAll('[form]'))
                .find(el => +el.style.order === order);
        }

        this.createABoard = function (rows, cols, arr) {
            this.playfield = document.querySelector('.playfield')
            this.playfield.style.display = 'grid';
            this.playfield.setAttribute('rows', rows)
            this.playfield.setAttribute('cols', cols)
            this.playfield.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)'; // Определяем структуру сетки
            for (let i = 0; i < arr.length; i++) {
                const cell = document.createElement('div');
                // cell.id = i;
                cell.style.order = i;
                cell.textContent = arr[i];
                cell.setAttribute('form', arr[i])
                cell.classList.add('element' + arr[i])
                this.playfield.appendChild(cell);
            }
        }

        this.getElementByOrder = function (order) { // возвращает элемент с указанным порядковым номером
            return Array.from(document.querySelectorAll('[form]'))
                .find(el => +el.style.order === order);
        }

        this.getCurrentFormsArray = function () {
            const elements = document.querySelectorAll('[form]');
            const orderedArr = [];

            elements.forEach(el => {
                const order = +el.style.order;
                const form = +el.getAttribute('form');
                if (!isNaN(order)) {
                    orderedArr[order] = form;
                }
            });

            return orderedArr;
        };


        this.liftAndDropMatchedElements = function (mergedMatches) {

            const view = this;
            const liftedOrders = mergedMatches.flat();

            liftedOrders.forEach(order => {

                const el = this.getElementByOrder(order);
                if (!el) return;

                const cellHeight = el.offsetHeight;

                el.setAttribute('data-lifted', 'true');
                el.style.transition = 'none';
                el.style.transform = `translateY(-${cellHeight}px)`;
                el.style.opacity = '0';

                // requestAnimationFrame(() => {
                //     el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                //     el.style.transform = 'translateY(0)';
                //     el.style.opacity = '1';
                // });
            });
        };

        this.showNoSwipes = function (startOrder, endOrder) {
            return new Promise(resolve => {
                const el1 = this.getElementByOrder(startOrder);
                const el2 = this.getElementByOrder(endOrder);
                el2.style.transition = 'none'
                el1.style.transition = 'none'
                if (!el1 || !el2) return resolve();

                const rect1 = el1.getBoundingClientRect();
                const rect2 = el2.getBoundingClientRect();

                const dx = rect2.left - rect1.left;
                const dy = rect2.top - rect1.top;

                // Свайп: элементы движутся навстречу друг другу
                el1.style.transition = 'transform 200ms ease';
                el2.style.transition = 'transform 200ms ease';
                el1.style.transform = `translate(${dx}px, ${dy}px)`;
                el2.style.transform = `translate(${-dx}px, ${-dy}px)`;

                setTimeout(() => {
                    el1.style.transition = '';
                    el2.style.transition = '';
                    // Первый кадр — сброс transition
                    // Второй кадр — сброс transform (теперь уже без анимации)
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            el1.style.transform = '';
                            el2.style.transform = '';
                            resolve();
                        });
                    });
                }, 250);
            });
        };

        this.showSwipes = function (startOrder, endOrder) {

            this.playfield.classList.add('locked')
  
            return new Promise(resolve => {
                const elA = this.getElementByOrder(startOrder);
                const elB = this.getElementByOrder(endOrder);
                if (!elA || !elB) {
                    this.playfield.classList.remove('locked')
                    return resolve();
                }

                const rectA = elA.getBoundingClientRect();
                const rectB = elB.getBoundingClientRect();

                // 1. Мгновенно меняем order, до начала анимации
                elA.style.order = endOrder;
                elB.style.order = startOrder;

                // 2. Получаем новые координаты после смены order
                const newRectA = elA.getBoundingClientRect();
                const newRectB = elB.getBoundingClientRect();

                // 3. Считаем обратный сдвиг — откуда были
                const offsetAX = rectA.left - newRectA.left;
                const offsetAY = rectA.top - newRectA.top;
                const offsetBX = rectB.left - newRectB.left;
                const offsetBY = rectB.top - newRectB.top;

                // 4. Устанавливаем начальный transform и убираем transition
                elA.style.transition = 'none';
                elB.style.transition = 'none';
                elA.style.transform = `translate(${offsetAX}px, ${offsetAY}px)`;
                elB.style.transform = `translate(${offsetBX}px, ${offsetBY}px)`;

                // 5. Следующий кадр — запускаем плавное движение в новые места
                requestAnimationFrame(() => {
                    elA.style.transition = 'transform 200ms ease';
                    elB.style.transition = 'transform 200ms ease';
                    elA.style.transform = 'translate(0, 0)';
                    elB.style.transform = 'translate(0, 0)';
                });

                // 6. По завершении анимации — чистим
                setTimeout(() => {
                    elA.style.transition = '';
                    elB.style.transition = '';
                    elA.style.transform = '';
                    elB.style.transform = '';
                    this.playfield.classList.remove('locked')
                    resolve();
                }, 200);
            });

        };

        this.animateFallAndRise = function (ordersToDrop, ordersToUp, columnsBefore, columnsAfter) {
            return new Promise(resolve => {
                const duration = 600;
                this.playfield.classList.add('locked')
                // const noShift = columnsBefore.every((val, i) => val === columnsAfter[i]);
                // if (noShift) {
                //     for (let order of ordersToUp) {
                //         const el = this.getElementByOrder(order);
                //         if (el) {
                //             // el.classList.add('red');
                //         }
                //     }
                //     return resolve();
                // }

                const elements = columnsAfter.map(order => this.getElementByOrder(order));
                const initialRects = elements.map(el => el?.getBoundingClientRect());
           
                // Поднимаемые делаем невидимыми (или красим)
                if (ordersToUp !== 0) { // при взрыве бомбы не вызывается
                    for (let order of ordersToUp) {
                        const el = this.getElementByOrder(order);
                        if (el && !el.getAttribute('form')?.includes('bomb')) {
            
                            // el.classList.add('invisible');

                            el.classList.add('red');

                        }
                    }
                }
                // Назначаем старые позиции
               

                const timerId = setTimeout(() => {
                    for (let i = 0; i < elements.length; i++) {
                    if (elements[i]) {
                        elements[i].style.order = columnsBefore[i];
                    }
                }

                requestAnimationFrame(() => {
                    for (let i = 0; i < elements.length; i++) {
                        const el = elements[i];
                        if (!el) continue;

                        const newRect = el.getBoundingClientRect();
                        const dx = initialRects[i].left - newRect.left;
                        const dy = initialRects[i].top - newRect.top;

                        el.style.transition = 'none';
                        el.style.transform = `translate(${dx}px, ${dy}px)`;
                    }

                    requestAnimationFrame(() => {
                        for (let el of elements) {
                            if (!el) continue;
                            el.style.transition = `transform ${duration}ms ease`;
                            el.style.transform = 'translate(0, 0)';
                        }

                        setTimeout(() => {
                            for (let el of elements) {
                                if (!el) continue;
                                el.style.transition = '';
                                el.style.transform = '';
                            }

                            // Удаляем класс только с падающих
                            document.querySelectorAll('.red').forEach(el => {
                                el.classList.remove('red');
                              });
                            this.playfield.classList.remove('locked')
                            resolve();
                        }, duration);
                    });
                });



                  }, 2000)
                  


            });
        };

        this.addNewElements = function (arr, newOrdersOfMatchedElements) {
            this.playfield.classList.add('locked')

           
            // Сохраняем dom-элементы до любых потенциальных изменений order
            const domElements = newOrdersOfMatchedElements.map(order => ({
                order,
                el: this.getElementByOrder(order)
            }));

            // Устанавливаем form и innerText каждому из них
            for (const { order, el } of domElements) {
                if (!el) continue;
                el.className = 'element' + arr[order]
                if (el.hasAttribute('bomb')) { el.removeAttribute('bomb') }
                el.setAttribute('form', arr[order]);
                el.innerText = arr[order];
            }
            this.playfield.classList.remove('locked')
        }

        this.redrawBoard = function (arr) {
            this.playfield.classList.add('locked')

            arr.forEach((form, index) => {
                const element = this.getElementByOrder(index);

                if (element) {
                    element.setAttribute('form', form);
                    element.innerHTML = form
                    element.classList = 'element' + form
                }
            });
            this.playfield.classList.remove('locked')
        };

        this.addBombs = function (arr, bombs, newBombOrders) {
            this.playfield.classList.add('locked')

      
            // for (let r = 0; r < this.rows; r++) {
            //     const row = arr.slice(r * this.cols, (r + 1) * this.cols);
            //     console.log(row.join(' '));
            // }

            return new Promise((resolve) => {
                bombs.forEach((el, i) => {

                    this.getElementByOrder(el).className = arr[newBombOrders[i]];
                    this.getElementByOrder(el).setAttribute('form', arr[newBombOrders[i]]);
                    this.getElementByOrder(el).setAttribute('bomb', arr[newBombOrders[i]]);
                    this.getElementByOrder(el).innerText = arr[newBombOrders[i]]
                });
                this.playfield.classList.remove('locked')
                resolve(); // Завершаем промис в любом случае
            });

        }

        this.animateBomb = function (startOrder) {
            this.playfield.classList.add('locked')
            return new Promise(resolve => {
                // Твоя анимация старта взрыва
                const bomb = this.getElementByOrder(startOrder)


                bomb.classList.add('KABOOM')
                // Ставишь таймер на продолжительность анимации
                setTimeout(() => {
                    // После окончания анимации убираешь класс (если нужно)
                    bomb.classList.remove('KABOOM');
                    bomb.classList.add('invisible');
                    this.playfield.classList.remove('locked')
                    resolve(); // Важно! Говорим, что всё, взрыв бомбы закончен
                }, 500); // допустим, анимация длится 500 мс
            });

        }

        this.animateAffected = function (normalOrders) {
            this.playfield.classList.add('locked')
            return new Promise(resolve => {
                // Твоя анимация старта взрыва
                normalOrders.forEach((el, i) => {
                    const element = this.getElementByOrder(normalOrders[i])

                    element.classList.add('KABOOM')
                    setTimeout(() => {
                        // После окончания анимации убираешь класс (если нужно)
                        element.classList.remove('KABOOM');
                        element.classList.add('invisible');
                        this.playfield.classList.remove('locked')
                        resolve(); // Важно! Говорим, что всё, взрыв бомбы закончен
                    }, 500);

                })
            });



        }









    };
    /* -------- end view --------- */
    /* ------- begin model ------- */
    function ModuleModel() {
        let myModuleView = null;
        let arr = null; // массив с элементами для игрового поля
        this.rows = 0; // количество строк элементов на игровом поле
        this.cols = 0; // количество столбцов элементов на игровом поле
        this.amountOfTypesOfElements = 0 // колияество видов элементов
        this.bombTypes = ['bomb1', 'bomb2']
        this.bombConfigs = {
            bomb1: { power: 1 },
            bomb2: { power: 2 },
            bomb3: { power: 3 }
        };
        this.init = function (view) {
            myModuleView = view;
        }

        this.levelConfigs = {
            first: { rows: 8, cols: 6, types: 5 },
            second: { rows: 10, cols: 8, types: 5 },
            third: { rows: 12, cols: 9, types: 5 }
        };

        this.updateState = function (hashPageName) { // вызов функции отрисовки игрового поля при выборе уровня
            myModuleView.renderContent(hashPageName);
            if (hashPageName.includes('_level')) {
                const level = hashPageName.replace('_level', '');
                const config = this.levelConfigs[level];
                if (config) {
                    this.rows = config.rows;
                    this.cols = config.cols;
                    this.amountOfTypesOfElements = config.types;
                    this.createLevel(this.rows, this.cols, this.amountOfTypesOfElements);
                }
            }
        };

        this.createOriginalGrid = function (rows, cols, amountOfTypesOfElements) {
            this.rows = rows
            this.cols = cols
            this.amountOfTypesOfElements = amountOfTypesOfElements
            return this.original = this.createAnArray(this.rows, this.cols, this.amountOfTypesOfElements);
        }

        this.getGridCopy = function () {
            return [...this.original]; // создаём независимую копию
        }

        this.synchronize = function (arr) {
            this.original = [...arr]; // копируем значения из arr
        }

        this.createLevel = function (rows, cols, amountOfTypesOfElements) {
            this.original = this.createOriginalGrid(rows, cols, amountOfTypesOfElements) // получение массива для заполнения игрового поля с учётом выбранного размера сетки элементов
            myModuleView.createABoard(rows, cols, this.original)
            // this.logGrid(this.original, rows, this.cols)
            return arr;
        }

        this.pickAForm = function (amountOfTypesOfElements) {
            return Math.floor(Math.random() * amountOfTypesOfElements) + 1; // функция для рандомного выбора вида игровых элементов
        }

        this.getSmartRandomForm = function (arr, amountOfRorms) {
            const formCounts = new Array(amountOfRorms).fill(0);

            arr.forEach(f => {
                if (f >= 0 && f < amountOfRorms) formCounts[f]++;
            });

            const maxCount = Math.max(...formCounts);
            const invertedWeights = formCounts.map(c => maxCount - c + 1);

            const totalWeight = invertedWeights.reduce((a, b) => a + b);
            const r = Math.random() * totalWeight;
            let sum = 0;

            for (let i = 0; i < invertedWeights.length; i++) {
                sum += invertedWeights[i];
                if (r < sum) return i;
            }

            return amountOfRorms - 1; // fallback, почти невозможен
        };

        this.createAnArray = function (rows, cols, amountOfTypesOfElements) {

            // let arr = [ //  пример 1 - при сайпе 2 бомбы в горизонтале
            //     0, 2, 2, 3, 2, 2,
            //     1, 3, 3, 2, 3, 3,
            //     0, 1, 0, 1, 0, 1,
            //     0, 2, 2, 3, 2, 2,
            //     1, 3, 3, 2, 3, 3,
            //     1, 3, 3, 2, 3, 3,
            //     0, 1, 0, 1, 0, 1,
            //     1, 0, 1, 0, 1, 0
            // ]

            // let arr = [//  пример 2 - при сайпе бомба Г лежит на потолке
            //     0, 1, 2, 2, 0, 2,
            //     1, 0, 1, 0, 2, 0,
            //     0, 1, 0, 1, 2, 1,
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 0, 1, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 0, 1, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            // ]


            // let arr = [ //пример 3 - при сайпе бомба L упирается в потолок, колонка упирается в потолок
            //     0, 2, 0, 1, 0, 1,
            //     1, 2, 1, 0, 1, 0,
            //     2, 3, 2, 2, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 0, 1, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 0, 1, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            // ]


            // let arr = [//  пример 4 - при сайпе 2 колонки упираются в потолок
            //     0, 1, 0, 1, 0, 3,
            //     1, 0, 1, 0, 0, 3,
            //     0, 1, 0, 1, 3, 0,
            //     1, 0, 1, 0, 0, 3,
            //     0, 1, 0, 1, 0, 3,
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 0, 1, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            // ]

            let arr = [//  пример 5 - при сайпе появляется "Т" большая бомба и упирается в потолок боком
                0, 3, 0, 1, 0, 1,
                1, 3, 1, 0, 1, 0,
                3, 2, 3, 3, 0, 1,
                1, 3, 1, 0, 1, 0,
                0, 3, 0, 1, 0, 1,
                1, 0, 1, 0, 1, 0,
                0, 1, 0, 1, 0, 1,
                1, 0, 1, 0, 1, 0,
            ]


            // let arr = [//  пример 6 - при сайпе "Т" появляется большая бомба и упирается в потолок 
            //     0, 1, 3, 1, 0, 1,
            //     1, 0, 3, 0, 1, 0,
            //     3, 3, 2, 3, 3, 1,
            //     1, 0, 3, 0, 1, 0,
            //     0, 1, 0, 1, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 0, 1, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            // ]

            // let arr = [//  пример 7 - при сайпе появляется бомба 1 первом ряду 
            //     0, 2, 2, 3, 2, 2,
            //     1, 0, 1, 2, 1, 0,
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 0, 1, 0, 1,
            //     0, 1, 0, 1, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 0, 1, 0, 1,

            // ]
            // let arr = [//  пример 8 - уже есть 1 бомба 
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 0, 1, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 'bomb1', 1, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 0, 1, 0, 1,

            // ]


            // let arr = [// пример 9 - после всего свайпа должна сложиться бомба
            //     0, 1, 0, 2, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 0, 1, 0, 1,
            //     1, 2, 2, 0, 2, 2,
            //     0, 1, 0, 1, 0, 1,
            //     1, 0, 1, 0, 1, 0
            // ]

            // let arr = [// пример 10 - после всего свайпа должна сложиться бомба
            //     0, 1, 0, 1, 0, 1,
            //     1, 0, 1, 0, 1, 0,
            //     0, 1, 2, 1, 0, 1,
            //     2, 2, 3, 3, 1, 3,
            //     0, 1, 2, 1, 0, 1,
            //     1, 0, 2, 0, 1, 0
            // ]


            // 0, 1, 0, 1, 0, 1,
            // 1, 0, 1, 0, 1, 0,
            // 0, 1, 0, 1, 0, 1,
            // 1, 0, 1, 0, 1, 0,
            // 0, 1, 0, 1, 0, 1,
            // 1, 0, 1, 0, 1, 0


            // let arr = [ // пример 10 - при свайпе 3 бомбы падают в ряд
            //     0, 2, 2, 3, 2, 2,
            //     1, 3, 3, 2, 3, 3,
            //     2, 3, 'bomb1', 0, 1, 2,
            //     'bomb1', 'bomb1', 2, 3, 3, 2,
            //     4, 0, 3, 0, 3, 4,
            //     0, 1, 2, 3, 4, 0,
            //     1, 3, 1, 4, 4, 1,
            //     0, 1, 2, 3, 2, 0,
            // ];

            // let arr = [
            //     0, 1, 2, 3, 4, 0,
            //     1, 2, 3, 4, 0, 1,
            //     2, 3, 4, 0, 1, 2,
            //     3, 4, 0, 1, 2, 3,
            //     4, 0, 1, 2, 3, 4,
            //     0, 1, 2, 3, 4, 0
            // ];


            for (let i = 0; i < rows * cols; i++) {
                let form;
                do {
                    form = this.getSmartRandomForm(arr, amountOfTypesOfElements);
                } while (this.willCauseMatch(arr, i, form, cols));
                arr[i] = form;
            }


            return arr
        }

        this.willCauseMatch = function (arr, index, form, rows) { // проверка отсутствия совпадений на 1 элемент
            const height = Math.floor(arr.length / rows);
            const row = Math.floor(index / rows);
            const col = index % rows;

            const check = (i) => i >= 0 && i < arr.length ? arr[i] : null;

            // Подставим form на это место
            const temp = [...arr];
            temp[index] = form;

            // Горизонталь
            let hor = 1;
            for (let i = col - 1; i >= 0; i--) {
                if (temp[row * rows + i] === form) hor++;
                else break;
            }
            for (let i = col + 1; i < rows; i++) {
                if (temp[row * rows + i] === form) hor++;
                else break;
            }
            if (hor >= 3) return true;

            // Вертикаль
            let vert = 1;
            for (let i = row - 1; i >= 0; i--) {
                if (temp[i * rows + col] === form) vert++;
                else break;
            }
            for (let i = row + 1; i < height; i++) {
                if (temp[i * rows + col] === form) vert++;
                else break;
            }
            if (vert >= 3) return true;
            return false;
        }

        this.swipe = function (startOrder = undefined, endOrder = undefined) {// замена в массиве значений переставленных элементов

            const arr = this.getGridCopy()

            // console.log('11111111111111111111111111111111111111111111111111111111111111111111111111')
            // for (let r = 0; r < this.rows; r++) {
            //     const row = arr.slice(r * this.cols, (r + 1) * this.cols);
            //     console.log(row.join(' '));
            // }

            const formOfFirstElement = arr[startOrder]
            const formOfSecondElement = arr[endOrder]
            arr[startOrder] = formOfSecondElement
            arr[endOrder] = formOfFirstElement
            return this.findRows(arr, startOrder, endOrder)

        }

        this.findRows = function (arr, startOrder, endOrder) {

            // console.log('222222222222222222222222222222222222222222222222222222222222222222')
            // for (let r = 0; r < this.rows; r++) {
            //     const row = arr.slice(r * this.cols, (r + 1) * this.cols);
            //     console.log(row.join(' '));
            // }
            const cols = this.cols;
            const matchedOrders = [];
            const seen = new Set();
            const pointsToCheck = [startOrder, endOrder];

            // Проверка горизонтали: убеждаемся, что всё в одной строке
            const checkHorizontal = (baseIndex) => {
                const line = [baseIndex];
                const row = Math.floor(baseIndex / cols);

                let i = baseIndex - 1;
                while (
                    i >= 0 &&
                    arr[i] === arr[baseIndex] &&
                    Math.floor(i / cols) === row
                ) {
                    line.unshift(i);
                    i--;
                }

                i = baseIndex + 1;
                while (
                    i < arr.length &&
                    arr[i] === arr[baseIndex] &&
                    Math.floor(i / cols) === row
                ) {
                    line.push(i);
                    i++;
                }

                return line.length >= 3 ? line : null;
            };

            // Проверка вертикали: идём вверх и вниз по колонке
            const checkVertical = (baseIndex) => {
                const line = [baseIndex];

                let i = baseIndex - cols;
                while (i >= 0 && arr[i] === arr[baseIndex]) {
                    line.unshift(i);
                    i -= cols;
                }

                i = baseIndex + cols;
                while (i < arr.length && arr[i] === arr[baseIndex]) {
                    line.push(i);
                    i += cols;
                }

                return line.length >= 3 ? line : null;
            };

            for (const point of pointsToCheck) {
                if (!seen.has(point)) {
                    const horizontal = checkHorizontal(point);
                    const vertical = checkVertical(point);

                    if (horizontal) {
                        horizontal.forEach(i => seen.add(i));
                        matchedOrders.push(horizontal);
                    }

                    if (vertical) {
                        vertical.forEach(i => seen.add(i));
                        matchedOrders.push(vertical);
                    }
                }
            }

            if (matchedOrders.length) { this.synchronize(arr) }

            let merged = [];
       
            if (matchedOrders.length > 0) {
                for (const match of matchedOrders) {
                    let toMerge = [];
                    let rest = [];

                    for (const group of merged) {
                        if (group.some(cell => match.includes(cell))) {
                            toMerge.push(...group);
                        } else {
                            rest.push(group);
                        }
                    }

                    merged = [...rest, [...new Set([...toMerge, ...match])]];
                }
            }
       




            // Фильтруем группы с участием бомб, если бомбы есть - не свайпаем
            const filteredMatches = merged.filter(group => {
                return group.every(order => !this.bombTypes.includes(arr[order]));
            });

            return filteredMatches.length ? this.checkForLines(arr, filteredMatches, startOrder, endOrder) : false;



        };

        this.checkForLines = function (arr, matchedOrders, startOrder, endOrder) {

            const newArr = JSON.parse(JSON.stringify(matchedOrders));
    
            const bombs = [];



            if (newArr.some(group => group.length >= 5)) { // ищем бомбы
                for (let group of newArr) {
                    const len = group.length;
                    if (len !== 5 && len !== 6 && len !== 7) continue;

                    const bombType = len === 7 ? 'bomb2' : 'bomb1';

                    let bombIndex = startOrder !== undefined && group.includes(startOrder)
                        ? startOrder
                        : startOrder !== undefined && group.includes(endOrder)
                            ? endOrder
                            : group[2];

                    // group.splice(group.indexOf(bombIndex), 1);
                    arr[bombIndex] = bombType;
                    bombs.push(bombIndex);
                }



            }






            const matchedSet = new Set();
            const aboveSet = new Set();
            let cols = this.cols, rows = this.rows

            // Соберём все номера из групп в matchedSet
            for (const group of newArr) {
                for (const index of group) {
                    matchedSet.add(index);
                }
            }
    
            // Для каждого совпавшего элемента найдём всё, что выше
            for (const index of matchedSet) {
                let aboveIndex = index - cols;
                while (aboveIndex >= 0) {
                    aboveSet.add(aboveIndex);
                    aboveIndex -= cols;
                }
            }

            let matched = [...matchedSet].sort((a, b) => a - b),
            above = [...aboveSet].sort((a, b) => a - b)

            if (above.length > 0) {

                // this.createcolumnsBefore(startId, endId, above, matched, arr, cols, rows) // allElementsToRedraw = только опускаемые элементы, allLineElements - только поднимаемые эелменты
            }

            let columnsBefore = []; // все затронутые элементы по колонкам (включая поднимаемые)
            const columnsAfter = [];       // с сортировкой: сначала поднимаемые, потом падающие
            const ordersToDrop = [];       // только падающие

            let id = 0;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {

                    const isAffected = above.includes(id) || matched.includes(id);

                    if (isAffected) {
                        if (!columnsBefore[col]) columnsBefore[col] = [];
                        columnsBefore[col].push(id); // добавляем в колонку
                    }

                    id++;
                }
            }
            // Удалим пустые колонки в начале (если есть)
            columnsBefore = columnsBefore.filter(col => Array.isArray(col) && col.length > 0);
            // Собираем columnsAfter
            let ordersToUp = []
            for (const col of columnsBefore) {
                const toLift = [];
                const toDrop = [];
                const bomb = [];
                for (const id of col) {
                    if (matched.includes(id) && !bombs.includes(id)) {
                        toLift.push(id); // надо поднять
                        ordersToUp.push(id)
                    }
                    else if (matched.includes(id) && bombs.includes(id)) {
                        bomb.push(id) // бомба
                        ordersToUp.push(id)
                    }
                    else {
                        toDrop.push(id); // надо уронить
                        ordersToDrop.push(id);
                    }
                }

                if (bomb.length > 0) { columnsAfter.push([...toLift, ...toDrop, ...bomb]); }
                else { columnsAfter.push([...toLift, ...toDrop]); }
                // columnsAfter.push([...toLift, ...toDrop]);

            }

            const newBombOrders = [];

            bombs.forEach((bombValue) => {
                for (let row = 0; row < columnsAfter.length; row++) {
                    const colIndex = columnsAfter[row].indexOf(bombValue);
                    if (colIndex !== -1) {
                        const originalOrder = columnsBefore[row][colIndex];
                        newBombOrders.push(originalOrder);
                        break; // нашли нужное значение, дальше не ищем
                    }
                }
            });

       

            let topMatches = [];
            matchedOrders = matchedOrders.flat()

            if (columnsAfter.length > 1) {
                for (let i = 0; i < columnsAfter.length; i++) { // мракобесие, которое находит столбы, где ничего не надо поднимать и заменять
                    const afterFlat = columnsAfter[i];
                    const beforeFlat = columnsBefore[i];

                    const isSame =
                        afterFlat.length === beforeFlat.length &&
                        beforeFlat.length > 2 &&
                        afterFlat.every((el, idx) => el === beforeFlat[idx]) &&
                        afterFlat.every(el => matchedOrders.includes(el));
    
                    if (isSame) {
                        topMatches = topMatches.concat(afterFlat);
                    }
                }
            }


            // }// ЕСЛИ ПОДНИМАТЬ НЕЧЕГО, НУЖНО ТОЛЬКО ПОМЕНЯТЬ
            if (ordersToDrop.length === 0) {
                for (let i = ordersToUp.length - 1; i >= 0; i--) {// вырезание из "поднимаемых" элементов старые индексы бомб, чтобы у них не включалась невидимость
                    if (bombs.includes(ordersToUp[i])) {
                        ordersToUp.splice(i, 1);
                    }
                }
            }

    
            this.synchronize(arr)

            if (ordersToDrop.length === 0) {
                const newBombOrders = [];
                bombs.forEach(bombIndex => {
                    const column = columnsBefore.find(col => col.includes(bombIndex));
                    if (!column || column.length === 0) {
                        console.warn("Бомба в пустоте или колонка не найдена:", bombIndex);
                        return;
                    }
                    const newBombIndex = column[column.length - 1];
                    newBombOrders.push(newBombIndex);
                });
                newBombOrders.forEach((el, i) => {
                    arr[el] = arr[bombs[i]]
                })

                if (Math.max(...matchedOrders) > this.cols) { // чтобы cоздавалась бомба в горизотальном ряду первой строчки
                    newBombOrders.forEach((el, i) => {
                        ordersToUp = ordersToUp.filter((n) => { return n != el });
                        ordersToUp.push(bombs[i]) // УБИРАЮ ВЫШЕ, ЧТОБЫ ПОТОМ ЗАПУШИТЬ? ГЕНИАЛЬНО!!!
                    })
                }


                if (bombs.length === 2 && Math.abs(bombs[0] - bombs[1]) === this.cols) {
                    ordersToUp = ordersToUp.filter(item => !bombs.includes(item));
                }


                //НУЖНО БЫЛО В СЛУЧАЕ 2 СТОЛБЦОВ, УПИРАЮЩИХСЯ В ПОТОЛОК, ПРИ СОВПАДЕНИИ КОТОРЫХ ДРУГ С ДРУГОМ ОБРАЗОВЫВАЛИСЬ 2 БОМБЫ
                const Y = []
                const lastW = Math.max(...bombs);
                const R = [];
                columnsBefore.forEach(row => {
                    row.forEach(num => {
                        if (num > lastW) {
                            Y.push(num);
                        }
                    });
                });

                //НУЖНО БЫЛО В СЛУЧАЕ 2 СТОЛБЦОВ, УПИРАЮЩИХСЯ В ПОТОЛОК, ПРИ СОВПАДЕНИИ КОТОРЫХ ДРУГ С ДРУГОМ ОБРАЗОВЫВАЛИСЬ 2 БОМБЫ


        
                const x = this.fillNewElements(arr, ordersToUp)


                return {
                    arr: x,
                    newOrdersOfMatchedElements: ordersToUp,
                    bombs,
                    newBombOrders,
                    Y,
                    columnsBefore: columnsBefore.flat(),
                    columnsAfter: columnsAfter.flat(),
                }
            }

            else {


                const x = this.makeColumns(columnsBefore.flat(), columnsAfter.flat(), arr, topMatches)

                return {
                    arr: x.arr,
                    newOrdersOfMatchedElements: x.newOrdersOfMatchedElements,
                    ordersToDrop,
                    ordersToUp,
                    columnsBefore: columnsBefore.flat(),
                    columnsAfter: columnsAfter.flat(),
                    bombs,
                    newBombOrders
                }

            }
        };
        // this.findBombs = function (arr) {
        //     const bombOrders = [];

        //     arr.forEach((element, index) => {
        //         if (this.bombTypes.includes(element)) {
        //             bombOrders.push(index);
        //         }
        //     });
        //     return bombOrders
        // }

        this.makeColumns = function (columnsBefore, columnsAfter, arr, topMatches) {

            // console.log('444444444444444444444444444444444444444444444444444')
            // for (let r = 0; r < this.rows; r++) {
            //     const row = arr.slice(r * this.cols, (r + 1) * this.cols);
            //     console.log(row.join(' '));
            // }


            const arrCopy = [...arr]; // защита от перезаписи
            const forms = columnsAfter.map(order => arrCopy[order]);

            columnsBefore.forEach((order, i) => {
                arrCopy[order] = forms[i];
            });


            const newOrdersOfMatchedElements = []; // ЗАЧЕМ НУЖНА ЭТА ХЕРЬ??????????????????????????????????????????????????????????????????? она мешает в случае 2 горизонтальных бомб -- элементы над этими бомбами меняются-- НУЖНА В ПРИМЕРЕ 3, когда весь ряд стоит вертикально и упирается в потолок
            topMatches.forEach((el, i) => {
                if (!this.bombTypes.includes(arr[el])) { newOrdersOfMatchedElements.push(el) }
            })

            columnsBefore.forEach((order, i) => {
                if (columnsAfter[i] > order && !this.bombTypes.includes(arr[order])) {
                    newOrdersOfMatchedElements.push(order);
                }
            });


            this.synchronize(arrCopy);

            return {
                arr: this.fillNewElements(arrCopy, newOrdersOfMatchedElements),
                newOrdersOfMatchedElements,

            };
        };

        this.fillNewElements = function (arr, newOrdersOfMatchedElements) {
            // console.log('5555555555555555555555555555555555555555555555555555555555555555')
            // for (let r = 0; r < this.rows; r++) {
            //     const row = arr.slice(r * this.cols, (r + 1) * this.cols);
            //     console.log(row.join(' '));
            // }

            // console.log(newOrdersOfMatchedElements)
            newOrdersOfMatchedElements.forEach((order) => {
                let form;
                do {
                    form = this.getSmartRandomForm(arr, this.amountOfTypesOfElements);
                } while (this.willCauseMatch(arr, order, form, this.cols));

                arr[order] = form;
            });

            // console.log('6666666666666666666666666666666666666666666666666666666666666666')
            // for (let r = 0; r < this.rows; r++) {
            //     const row = arr.slice(r * this.cols, (r + 1) * this.cols);
            //     console.log(row.join(' '));
            // }

            this.synchronize(arr)
            // console.log(arr)
            return arr;
        }

        this.findAllMatches = function () {
            const arr = this.getGridCopy();
            const cols = this.cols;
            const matchedGroups = [];

            const checkHorizontal = (i) => {
                const group = [i];
                const row = Math.floor(i / cols);
                let j = i + 1;
                while (
                    j < arr.length &&
                    arr[j] === arr[i] &&
                    Math.floor(j / cols) === row
                ) {
                    group.push(j);
                    j++;
                }
                if (group.length >= 3 && !group.some(index => this.bombTypes.includes(arr[index]))) {
                    return group;
                }
                return null;
            };

            const checkVertical = (i) => {
                const group = [i];
                const startVal = arr[i];
                let j = i + cols;
                while (
                    j < arr.length &&
                    arr[j] === startVal &&
                    j % cols === i % cols
                ) {
                    group.push(j);
                    j += cols;
                }
                if (group.length >= 3 && !group.some(index => this.bombTypes.includes(arr[index]))) {
                    return group;
                }
                return null;
            };

            // Первый проход — горизонталь
            for (let i = 0; i < arr.length; i++) {
                const h = checkHorizontal(i);
                if (h) matchedGroups.push(h);
            }

            // Второй проход — вертикаль
            for (let i = 0; i < arr.length; i++) {
                const v = checkVertical(i);
                if (v) matchedGroups.push(v);
            }

            // Слияние пересекающихся групп
            let merged = [];

            for (const match of matchedGroups) {
                let toMerge = [];
                let rest = [];

                for (const group of merged) {
                    if (group.some(cell => match.includes(cell))) {
                        toMerge.push(...group);
                    } else {
                        rest.push(group);
                    }
                }

                merged = [...rest, [...new Set([...toMerge, ...match])]];
            }

            if (merged.length === 0) return [];

            return this.checkForLines(arr, merged);
        };

        this.hasAnyPossibleMatch = function (arr) {
            // console.log('Проверка на возможные ходы началась');
            arr = arr || this.getGridCopy();
            // const arr = this.getGridCopy();
            const cols = this.cols;

            const canSwap = (i1, i2) => {
                const testArr = [...arr];
                [testArr[i1], testArr[i2]] = [testArr[i2], testArr[i1]];
                const matches = this.findMatchesInArray(testArr, cols) || [];
                return matches.length > 0;
            };

            for (let i = 0; i < arr.length; i++) {
                const right = i + 1;
                const down = i + cols;

                if (right % cols !== 0 && canSwap(i, right)) {
                    // console.log('Есть хотя бы один возможный ход по горизонтали');
                    return true; // нашёлся возможный ход по горизонтали
                }

                if (down < arr.length && canSwap(i, down)) {
                    // console.log('Есть хотя бы один возможный ход по вертикали');
                    return true; // нашёлся возможный ход по вертикали
                }
            }

            // если потенциальных совпадений нет
            return false;
        };

        this.findMatchesInArray = function (arr) { // найти все совпадения
            const cols = this.cols
            const matches = [];
            const rows = Math.floor(arr.length / cols);

            // Горизонтальные совпадения
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols - 2; c++) {
                    const i = r * cols + c;
                    if (arr[i] !== undefined && arr[i] === arr[i + 1] && arr[i] === arr[i + 2]) {
                        matches.push([i, i + 1, i + 2]);
                    }
                }
            }

            // Вертикальные совпадения
            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows - 2; r++) {
                    const i = r * cols + c;
                    if (arr[i] !== undefined && arr[i] === arr[i + cols] && arr[i] === arr[i + 2 * cols]) {
                        matches.push([i, i + cols, i + 2 * cols]);
                    }
                }
            }

            return matches;
        };

        this.smartReshuffleBoard = function () { // перемешать формы в случае отсутстия потенциальных совпадений
            let flat = this.getGridCopy();
            const cols = this.cols;
            const maxAttempts = 5000;
            let attempts = 0;

            function swap(arr, i, j) {
                const temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }

            function getRandomIndex(length) {
                return Math.floor(Math.random() * length);
            }

            do {
                const i = getRandomIndex(flat.length);
                const j = getRandomIndex(flat.length);

                if (i !== j) {
                    swap(flat, i, j);
                }

                attempts++;
            } while (!this.hasAnyPossibleMatch(flat) && attempts < maxAttempts);

            this.synchronize(flat);
            return flat
        };

        this.logGrid = function (arr, rows, cols) { // вывести массив гридом для дебага
            if (!arr) {
                arr = this.getGridCopy()
            }
            rows = this.rows
            cols = this.cols
            // for (let r = 0; r < rows; r++) {
            //     const row = arr.slice(r * cols, (r + 1) * cols);
            //     console.log(row.join(' '));
            // }
        }

        this.explodeBomb = async function (startOrder, startPower, arr = null) {
            const replaceWith = 'KABOOM!';
            const cols = this.cols;
            const rows = this.rows;
            const bombTypes = Object.keys(this.bombConfigs);
            const result = [];

            if (!arr) {
                arr = this.getGridCopy();
            }

            const startRow = Math.floor(startOrder / cols);
            const startCol = startOrder % cols;

            // Сбор всех поражённых ячеек вокруг бомбы
            for (let dRow = -startPower; dRow <= startPower; dRow++) {
                for (let dCol = -startPower; dCol <= startPower; dCol++) {
                    const newRow = startRow + dRow;
                    const newCol = startCol + dCol;

                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                        const newOrder = newRow * cols + newCol;
                        if (newOrder !== startOrder) {
                            result.push(newOrder);
                        }
                    }
                }
            }

            // Определяем новые бомбы
            const newBombs = result.filter(order => bombTypes.includes(arr[order]));

            // Анимация
            await myModuleView.animateBomb(startOrder);
            const normalOrders = result.filter(order => !bombTypes.includes(arr[order]));

            await myModuleView.animateAffected(normalOrders);

            // Удаление из модели
            const ordersToEmpty = [...normalOrders, startOrder];
            ordersToEmpty.forEach(order => arr[order] = replaceWith);

            // Каскадные взрывы
            let cascaded = [];

            if (newBombs.length > 0) {
                const results = await Promise.all(
                    newBombs.map(bombOrder => {
                        const bombType = arr[bombOrder];
                        const bombPower = this.bombConfigs[bombType]?.power || 1;
                        return this.explodeBomb(bombOrder, bombPower, arr);
                    })
                );
                cascaded = results.flat();
            }

            const allKABOOMed = [...ordersToEmpty, ...cascaded];

            // Отладка
            // for (let r = 0; r < this.rows; r++) {
            //     const row = arr.slice(r * cols, (r + 1) * cols);
            //     console.log(row.join(' '));
            // }

            this.synchronize(arr)
            // Обработка падений

            return allKABOOMed;
        };

        this.raiseKABOOMedElements = async function (ordersToRaise) {
            const arr = this.getGridCopy()
            const cols = this.cols;
            const rows = this.rows;
            const columnsMap = new Map();
            const newUpped = [];
            // Сначала соберём все order-колонки, в которых что-то должно подняться или упасть
            ordersToRaise.forEach(order => { // все колонки, в которых будет что-то меняться
                const col = order % cols;
                if (!columnsMap.has(col)) {
                    columnsMap.set(col, []);
                }
                columnsMap.get(col).push(order);
            });

            // Теперь можно по этим колонкам собрать все индексы в этих колонках
            let columns = [];

            columnsMap.forEach((ordersInCol, colIndex) => {// все эти колонки с индексами
                const column = [];
                for (let row = 0; row < rows; row++) {
                    const index = row * cols + colIndex;
                    column.push(index);
                }
                columns.push(column);
            });


            const after = []
            const before = []
            columns.forEach((column, columnIndex) => {// собираем колонки after с учётом возможножного наличия расстояния между взорванными клетками
                let upper = []
                let kaboomed = []
                let isKaboom = false
                let maybeBottom = []
                column.forEach((element, elementIndex) => {
                    if (!ordersToRaise.includes(element) && !isKaboom) {
                        upper.push(element)
                    }
                    if (ordersToRaise.includes(element)) {
                        if (maybeBottom.length > 0) {
                            upper = [...upper, ...maybeBottom]
                            maybeBottom = []
                        }
                        isKaboom = true
                        kaboomed.push(element)
                    }
                    if (!ordersToRaise.includes(element) && isKaboom) {
                        maybeBottom.push(element)
                    }
                })
                after.push([...kaboomed, ...upper])
            })


            for (let i = 0; i < after.length; i++) {
                before.push([])
                for (let j = 0; j < after[i].length; j++) {
                    before[i].push(columns[i][j])
                }
            }

            const newArr = [...arr]
            for (let i = 0; i < after.length; i++) {
                for (let j = 0; j < after[i].length; j++) {
                    if (after[i][j] > before[i][j]) { newUpped.push(before[i][j]) }


                    arr[before[i][j]] = newArr[after[i][j]]
                    // else { break; }
                }
            }
         



            // for (let r = 0; r < this.rows; r++) {
            //     const row = arr.slice(r * this.cols, (r + 1) * this.cols);
            //     console.log(row.join(' '));
            // }





            this.synchronize(arr)
            return { newUpped, before: before.flat(), after: after.flat() }
        };




    }

    /* -------- end model -------- */
    /* ----- begin controller ---- */
    function ModuleController() {
        let myModuleContainer = null;
        let myModuleModel = null;
        let myModuleView = null;
        this.cols = 0;
        this.rows = 0;
        this.isAnimating = false;

        this.init = function (container, model, view) {
            myModuleContainer = container;
            myModuleModel = model;
            myModuleView = view;
            this.createObserver();
            window.addEventListener("hashchange", this.updateState);
            this.updateState();
        };

        this.updateState = function () {
            const hashPageName = location.hash.slice(1).toLowerCase();
            myModuleModel.updateState(hashPageName);
        };

        this.createObserver = function () {
            const observer = new MutationObserver(() => {
                const playfield = document.querySelector('.playfield');
                if (playfield) this.bombClickHandler(playfield)
                if (playfield && !playfield.dataset.initialized) {
                    this.cols = +playfield.getAttribute('cols');
                    this.rows = +playfield.getAttribute('rows');
                    playfield.dataset.initialized = 'true';
                    this.setupPlayfield(playfield);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        };

        this.setupPlayfield = function (playfield) {
            playfield.addEventListener('pointerdown', this.handlePointerDown.bind(this));
            playfield.addEventListener('click', this.handleBombClick.bind(this));
        };

        this.handlePointerDown = function (event) {
            if (this.isAnimating || (event.pointerType !== 'mouse' && event.pointerType !== 'touch')) return;

            const startEl = event.target.closest('[form]');
            if (!startEl) return;

            const playfield = document.querySelector('.playfield');

            let startOrder = parseInt(startEl.style.order); // сохраняем стартовый order внутри функции и он остаётся доступен

            const onPointerMove = (moveEvent) => {
                const endEl = moveEvent.target.closest('[form]');
                if (!endEl) return;

                const endOrder = parseInt(endEl.style.order);

                const diff = Math.abs(startOrder - endOrder);
                const startRow = Math.floor(startOrder / this.cols);
                const endRow = Math.floor(endOrder / this.cols);

                const isLeftOrRight = diff === 1 && startRow === endRow;
                const isVertical = diff === this.cols;

                if (isLeftOrRight || isVertical) {
                    playfield.removeEventListener('pointermove', onPointerMove);
                    this.processSwipe(startOrder, endOrder); // вызываем свайп с сохранённым startOrder
                }
            };

            playfield.addEventListener('pointermove', onPointerMove);
            playfield.addEventListener('pointerup', () => playfield.removeEventListener('pointermove', onPointerMove), { once: true });
            playfield.addEventListener('mouseleave', () => playfield.removeEventListener('pointermove', onPointerMove), { once: true });
        };

        this.bombClickHandler = function (playfield) {

            if (playfield._bombClickHandlerInitialized) return; // если уже есть - не вешаем второй раз
            playfield._bombClickHandlerInitialized = true;

            playfield.addEventListener('click', async (event) => {
                const target = event.target.closest('[form]');
                if (!target) return;

                const formType = target.getAttribute('form');

                if (formType === 'bomb1' || formType === 'bomb2') {
                    const bombOrder = parseInt(target.style.order);
                    const bombPower = formType === 'bomb1' ? 1 : 2;

                    const explodedBombs = await myModuleModel.explodeBomb(bombOrder, bombPower);

                    const raiseKABOOMedElements = await myModuleModel.raiseKABOOMedElements(explodedBombs);

                    let arr = myModuleModel.getGridCopy()

                    arr = myModuleModel.fillNewElements(arr, raiseKABOOMedElements.newUpped)
                    await this.processUntilNoMatches(); // СОМНИТЕЛЬНО

                    await myModuleView.animateFallAndRise(0, 0, raiseKABOOMedElements.before, raiseKABOOMedElements.after);
                    await myModuleView.addNewElements(arr, raiseKABOOMedElements.newUpped);

                    
                    console.log('--------------------------------------------');
                  for (let r = 0; r < this.rows; r++) {
                const row = arr.slice(r * this.cols, (r + 1) * this.cols);
                console.log(row.join(' '));
            }
                    console.log('--------------------------------------------');
                }
            });
        };

        this.processSwipe = async function (startOrder, endOrder) {

            const result = myModuleModel.swipe(startOrder, endOrder);
            if (!result) return myModuleView.showNoSwipes(startOrder, endOrder);

            const { arr, newOrdersOfMatchedElements, ordersToDrop, ordersToUp, columnsBefore, columnsAfter, bombs, newBombOrders, Y } = result;
            // console.log('ordersToUp:' + ordersToUp)
            // console.log(newOrdersOfMatchedElements)
            await myModuleView.showSwipes(startOrder, endOrder);

            if (bombs.length > 0) await myModuleView.addBombs(arr, bombs, newBombOrders);

            if (ordersToDrop) {

                // console.log('ordersToDrop:' + ordersToDrop)
                // console.log('ordersToUp:' + ordersToUp)
                // console.log('columnsBefore:' + columnsBefore)
                // console.log('columnsAfter:' + columnsAfter)

                await myModuleView.animateFallAndRise(ordersToDrop, ordersToUp, columnsBefore, columnsAfter);
            }
            if (!ordersToDrop && bombs.length > 0) {

                await myModuleView.animateFallAndRise(0, Y, columnsBefore, columnsAfter);

            }

            if (newOrdersOfMatchedElements) {
                await myModuleView.addNewElements(arr, newOrdersOfMatchedElements);
            }

            await this.processUntilNoMatches();

            if (!myModuleModel.hasAnyPossibleMatch()) {
                const reshuffledArr = await myModuleModel.smartReshuffleBoard();
                myModuleView.redrawBoard(reshuffledArr);
            }

            console.log('---------------------------------------------------');
        for (let r = 0; r < this.rows; r++) {
                const row = arr.slice(r * this.cols, (r + 1) * this.cols);
                console.log(row.join(' '));
            }
            console.log('------------------------------------------');

        };

        this.processUntilNoMatches = async function () {
            let found;
            do {
                found = await this.processOneMatchCycle();
            } while (found);
        };

        this.processOneMatchCycle = async function () {
            const match = myModuleModel.findAllMatches();
            if (!match) return false;

            const { arr, newOrdersOfMatchedElements, ordersToDrop, ordersToUp, columnsBefore, columnsAfter, bombs, newBombOrders, Y } = match;
            if (bombs && bombs.length > 0) await myModuleView.addBombs(arr, bombs, newBombOrders);
            if (ordersToDrop) {
                await myModuleView.animateFallAndRise(ordersToDrop, ordersToUp, columnsBefore, columnsAfter);
            }

            if (newOrdersOfMatchedElements) {
                await myModuleView.addNewElements(arr, newOrdersOfMatchedElements);
            }

            return !!(ordersToDrop || newOrdersOfMatchedElements);
        };

        this.handleBombClick = function (event) {
            const target = event.target;
            if (target.hasAttribute('bomb')) {
                const order = Number(target.style.order);
                console.log(`Бомба активирована на клетке ${order}`);
                // Здесь потом вызовешь свою функцию взрыва
            }
        };
    }
    /* ------ end controller ----- */

    return {
        init: function (container) {
            // @TODO: add validation of `container`
            this.main(container);

            const view = new ModuleView();
            const model = new ModuleModel();
            const controller = new ModuleController();

            //связываем части модуля
            view.init(document.getElementById(container));
            model.init(view);
            controller.init(document.getElementById(container), model, view);
        },

        main: function (container) {
            //предварительно что-то можно сделать
            console.log(`Иницилизируем SPA для контейнера "${container}"`);
        },
    };

}());
/* ------ end app module ----- */

/*** --- init module --- ***/
document.addEventListener("DOMContentLoaded", mySPA.init("root")); // инициализируем модуль как только DOM готов.