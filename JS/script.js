var tasks;

function takeJson() {
    $.ajax( {
        async: false,
        type: "GET",
        url: "http://localhost:8080/tasks",
        dataType: "json",
        statusCode: {
            404: function () {
                alert("404 error");
            },
        },
        success: function (out) {
            tasks = out;
        },
        error: function (e) {
            alert("Error connection");
        }
    });
}

takeJson();

var totalElements = tasks.page.totalElements;
var ol = document.createElement('ol');
document.body.appendChild(ol);

for (var i = 0; i < totalElements; ++i) {

    var li = document.createElement('li');
    var task = "" + tasks._embedded.tasks[i].taskName;
    var font = document.createElement('font');
    var text = document.createTextNode(task);
    font.appendChild(text);
    li.appendChild(font);
    li.appendChild(addCheckbox(tasks._embedded.tasks[i].taskStatus));
    li.appendChild(addDeleteButton());
    li.appendChild(addEditButton(task));
    ol.appendChild(li);

}

deleteTask();
changeTaskStatus();
changeTaskName();
addTask();

function addDeleteButton() {
    var button = document.createElement("Button");
    var textButton = document.createTextNode("Delete");
    button.appendChild(textButton);
    button.setAttribute("class", "deleteButtonId");
    return button;
}

function deleteTask() {
    $(".deleteButtonId").click(function() {
        var $li = $(this).parent();
        if (confirm("Are you sure want delete task #" + $li.index() + "?")) {

            $.ajax({
                url: tasks._embedded.tasks[$li.index()]._links.self.href, // task URL
                type: "DELETE",
                statusCode: {
                    200: function() {
                        alert("task succsessfully deleted");

                    },
                    204: function() {
                        alert("task succsessfully deleted");
                    },
                    404: function() {
                        alert("something went wrong, taskId not found or invalid");
                    }
                },
                success: function() {
                    $($li.index()).add($li).remove(); //remove from page
                    takeJson(); //reload list

                },
                error: function() {
                    alert("something went wrong, taskId not found or invalid");
                }
            })

        }

    });
}

function addCheckbox(status) {
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("class", "statusId");

    if (status) {
        checkbox.checked = true;
    }
    return checkbox;
}

function changeTaskStatus() {
    $(".statusId").click(function() {
        var $li = $(this).parent();
        var data  = {
            "taskName": tasks._embedded.tasks[$(this).parent().index()].taskName,
            "taskStatus": this.checked
        }

        $.ajax({
            url: tasks._embedded.tasks[$li.index()]._links.self.href, // task URL
            type: "PUT",
            //data: tasks._embedded.tasks[$(this).parent().index()].taskName + "=" + this.checked,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            dataType: "json",

            statusCode: {
                200: function() {
                    //alert("task status successfully changed");
                },
                204: function() {
                    //alert("task status successfully changed");
                },
                404: function() {
                    alert("something went wrong, task status will not be saved on the server");
                    // change back status

                }
            },
            success: function() {
                alert("task status successfully changed");
                tasks._embedded.tasks[$li.index()].taskStatus = data.taskStatus;
            }

        })

    });
}

function addEditButton() {
    var button = document.createElement("Button");
    var textButton = document.createTextNode("Edit");
    button.appendChild(textButton);
    button.setAttribute("class", "editButton");
    return button;
}

function changeTaskName() {
    $(".editButton").click(function() {
        var $li = $(this).parent();

        var editText = document.createElement("input");
        editText.type = "text";
        editText.setAttribute("id", "editText");
        editText.value = tasks._embedded.tasks[$li.index()].taskName;
        document.body.appendChild(editText);
        $("#editText").focus();

        var updateButton = document.createElement("Button");
        var textButton = document.createTextNode("Update");
        updateButton.appendChild(textButton);
        updateButton.setAttribute("id", "updateButton");
        document.body.appendChild(updateButton);

        $("#updateButton").click(function() {
            var data  = {
                "taskName": editText.value,
                "taskStatus": tasks._embedded.tasks[$li.index()].taskStatus
            }
            $.ajax({
                url: tasks._embedded.tasks[$li.index()]._links.self.href, // task URL
                type: "PUT",
                //data: tasks._embedded.tasks[$(this).parent().index()].taskName + "=" + this.checked,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(data),
                dataType: "json",

                statusCode: {
                    200: function() {
                        //alert("task status successfully changed");
                    },
                    204: function() {
                        //alert("task status successfully changed");
                    },
                    404: function() {
                        alert("something went wrong, task name will not be saved on the server");
                        // change back status

                    }
                },
                success: function() {
                    var taskText = $("li font").eq($li.index()).text(editText.value);
                    tasks._embedded.tasks[$li.index()].taskName = data.taskName;

                    $("#editText").remove();
                    $("#updateButton").remove();
                    $("#cancelButton").remove();
                    //editText.value = "";


                    alert("task name successfully changed");
                }

            })

        });

        var cancelButton = document.createElement("Button");
        textButton = document.createTextNode("Cancel");
        cancelButton.appendChild(textButton);
        cancelButton.setAttribute("id", "cancelButton");
        document.body.appendChild(cancelButton);

        $("#cancelButton").click(function() {
            $("#editText").remove();
            $("#updateButton").remove();
            $("#cancelButton").remove();

        });

    });
}

function addTask() {
    $("#addButtonId").click(function() {
        var $li = $(this).parent();
        var inputTask;
        inputTask = document.getElementById('inputTask').value;
        alert(inputTask);
        var data  = {
            "taskName": inputTask,
            "taskStatus": false
        }
        $.ajax({
            url: "http://localhost:8080/tasks", // task URL
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            dataType: "json",
            statusCode: {
                200: function() {
                    alert("task succsessfully added");

                },
                201: function() {
                    alert("task succsessfully added");

                },
                409: function() {
                    alert("something went wrong, taskId not found or invalid");
                },
                404: function() {
                    alert("something went wrong, taskId not found or invalid");
                }
            },
            success: function() {
                //$($li.index()).add($li).remove(); //remove from page
                var li = document.createElement('li');
                var task = inputTask;
                var font = document.createElement('font');
                var text = document.createTextNode(task);
                font.appendChild(text);
                li.appendChild(font);
                li.appendChild(addCheckbox(false));
                li.appendChild(addDeleteButton());
                li.appendChild(addEditButton(task));
                ol.appendChild(li);
                takeJson(); //reload list

            }
        })
    })
}