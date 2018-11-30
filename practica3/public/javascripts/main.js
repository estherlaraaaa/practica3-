window.onload = () => app.init();

let app = {
    init: function () {
        this.addEvents();
        this.loadContent();
    },

    addEvents: function () {
        let form = document.saveTarea;
        form.addEventListener('submit', this.submit);
    },
    loadContent: function () {
        fetch('/tarea')
            .then(res => {
                return res.json()
            }).then(data => {
                let tareas = document.getElementsByClassName('tareas')[0];
                tareas.innerHTML = data.tareas.reduce((cadena, element) => {
                    return cadena +
                        `<tr>
                        <td class="tarea">${element.tarea}</td>
                        <td class="descripcion">${element.descripcion}</td>
                        <td class="propietario">${element.propietario}</td>
                        <td class="opciones"> 
                            <a data-id="${element.tareaId}" class="btn btn-danger delete" href="#"> Delete </a> 
                            <a data-id="${element.tareaId}" class="btn btn-success more" href="#"> More </a>
                            <a data-id="${element.tareaId}" class="btn btn-warning edit" href="#"> Edit </a>  
                        </td>
                    </tr>`
                }, "")

                document.querySelectorAll(".delete").forEach(element => {
                    element.addEventListener('click', function (event) {
                        event.preventDefault();
                        let id = element.getAttribute("data-id");
                        fetch('/tarea/' + id, {
                            method: 'DELETE'
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    tareas.removeChild(element.parentElement.parentElement);
                                    console.log("tarea eliminada con exito");
                                }
                            }).catch(err => {
                                console.log(err);
                            });
                    });
                });

                document.querySelectorAll(".more").forEach(element => {
                    element.addEventListener('click', function (event) {
                        event.preventDefault();
                        console.log(this.parentElement.parentElement.getElementsByTagName('td')[0].innerText)
                        let tarea = this.parentElement.parentElement.getElementsByTagName('td');
                        alert("Tareas: " + tarea[0].innerText + '\n' + "Descripcion: " + tarea[1].innerText+ "Propietario: " + tarea[2].innerText);
                    });
                });

                document.querySelectorAll(".edit").forEach(element => {
                    element.addEventListener('click', function (event) {
                        event.preventDefault();
                        let id = element.getAttribute("data-id");
                        fetch('/tarea/' + id)
                            .then(res => res.json()
                            ).then(data => {
                                let form = document.forms.saveDocumento;

                                form.tarea.value = data.tarea;
                                form.descripcion.value = data.descripcion;
                                form.propietario.value = data.propietario;
                                form.action = "/tarea/" + data.tareaId;
                            });
                    });
                });
            });
    },
   submit: function (event) {
        event.preventDefault();
        let form = document.saveTarea;
        console.log("enviando tareas");
        let tarea = {
            tarea: form.tarea.value,
            descripcion: form.descripcion.value,
            propietario: form.propietario.value
        };
        if (form.action.split('/').pop() == 'tarea') {
            fetch(form.action, {
                method: 'POST',
                body: JSON.stringify(tarea),
                headers: {
                    'Content-Type': 'application/json' //solo para mandar datos
                }
            }).then(res => {
                return res.json();
            }).then(data => {
                if (data.success) {
                    let tr = document.createElement("tr");
                    tr.innerHTML = `<td>${tarea.tarea}</td>
                                    <td>${tarea.descripcion}</td>
                                    <td>${tarea.propietario}</td>`;
                    document.getElementsByClassName("tareas")[0].appendChild(tr);
                } else {
                    let err = document.getElementsByClassName('erros')[0];
                    err.innerHTML = "Tarea guardada con exito";
                }
            });
        } else {
            fetch(form.action, {
                method: 'PUT',
                body: JSON.stringify(tarea),
                headers: {
                    'Content-Type': 'application/json' //solo para mandar datos
                }
            }).then(res => res.json())
                .then(data => {
                    if (data.success) {
                        form.action = '/tarea';
                        form.method = 'POST';
                        alert('Los tareas fueron actualizadas ');
                        form.tarea.value = form.tarea.value =
                            form.descripcion.value = form.propietario.value ="";
                        loadContent();
                    }
                });
        }
    }
}