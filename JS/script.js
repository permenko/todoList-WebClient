var tasks;

/*
Load taskList from server
 */

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

/*
Put elemnts on page
 */
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

/*
Create and add delete button
 */
function addDeleteButton() {
    var button = document.createElement("Button");
    var textButton = document.createTextNode("Delete");
    button.appendChild(textButton);
    button.setAttribute("class", "deleteButtonId");
    return button;
}

/*
Delete button click action
 */
function deleteTask() {
    $(".deleteButtonId").click(function() {
        var $li = $(this).parent(); // li emlement
        if (confirm("Are you sure want delete task #" + $li.index() + "?")) {

            $.ajax({ // rest request
                async: false,
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
                    $($li.index()).add($li).remove(); //remove task from page

                    $("#editText").remove(); //remove editText element
                    $("#updateButton").remove(); //remove update button
                    $("#cancelButton").remove(); //remove cancel button

                    takeJson(); //reload task list

                },
                error: function() {
                    alert("something went wrong, taskId not found or invalid");
                }
            })

        }

    });
}

/*
Create and add checkbox with status of task
 */
function addCheckbox(status) {
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("class", "statusId");

    if (status) { // set status from database
        checkbox.checked = true;
    }
    return checkbox;
}

/*
Checkbox click action
 */
function changeTaskStatus() {
    $(".statusId").click(function() {
        var $li = $(this).parent(); // li element
        var data  = { //data to load to database
            "taskName": tasks._embedded.tasks[$(this).parent().index()].taskName, // current taskName
            "taskStatus": this.checked //changed taskStatus
        }

        $.ajax({
            async: false,
            url: tasks._embedded.tasks[$li.index()]._links.self.href, // task URL
            type: "PUT",
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
                tasks._embedded.tasks[$li.index()].taskStatus = data.taskStatus; //changing task status in local variable
            }

        })

    });
}
/*
Create and add edit button
 */

function addEditButton() {
    var button = document.createElement("Button");
    var textButton = document.createTextNode("Edit");
    button.appendChild(textButton);
    button.setAttribute("class", "editButton");
    return button;
}
/*
Edit button click action
 */
function changeTaskName() {
    $(".editButton").click(function() {
        var $li = $(this).parent(); // li element

        /*
        Create inputText element with current taskName
         */
        var editText = document.createElement("input");
        editText.type = "text";
        editText.setAttribute("id", "editText");
        editText.value = tasks._embedded.tasks[$li.index()].taskName;
        document.body.appendChild(editText);
        $("#editText").focus(); // focus on inputText element
        /*
        Create update button
         */
        var updateButton = document.createElement("Button");
        var textButton = document.createTextNode("Update");
        updateButton.appendChild(textButton);
        updateButton.setAttribute("id", "updateButton");
        document.body.appendChild(updateButton);
        /*
        Update button click action
         */
        $("#updateButton").click(function() {
            var data  = { // data to load to database
                "taskName": editText.value, //changed taskname from editText element
                "taskStatus": tasks._embedded.tasks[$li.index()].taskStatus //current taskStatus
            }
            $.ajax({
                async: false,
                url: tasks._embedded.tasks[$li.index()]._links.self.href, // task URL
                type: "PUT",
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
                    $("li font").eq($li.index()).text(editText.value); //changing taskName on page
                    tasks._embedded.tasks[$li.index()].taskName = data.taskName; //changing taskName in local variable

                    $("#editText").remove(); //remove editText element
                    $("#updateButton").remove(); //remove update button
                    $("#cancelButton").remove(); //remove cancel button
                    //editText.value = "";


                    alert("task name successfully changed");
                }

            })

        });
        /*
        Create and add cancel button
         */
        var cancelButton = document.createElement("Button");
        textButton = document.createTextNode("Cancel");
        cancelButton.appendChild(textButton);
        cancelButton.setAttribute("id", "cancelButton");
        document.body.appendChild(cancelButton);
        /*
        Cancel button click action
         */
        $("#cancelButton").click(function() {
            $("#editText").remove(); //remove editText element
            $("#updateButton").remove(); //remove update button
            $("#cancelButton").remove(); //remove cancel button

        });

    });
}
/*
Creare and add AddTask button
 */
function addTask() {
    $("#addButtonId").click(function() {
        var $li = $(this).parent(); //le element
        var inputTask;
        inputTask = document.getElementById('inputTask').value; //take new taskName
        //alert(inputTask);
        var data  = { // data to load to database
            "taskName": inputTask, //taskName
            "taskStatus": false //taskStatus
        }
        $.ajax({
            async: false,
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
                    /*
                     Adding new task on page
                     */
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


                    document.getElementById('inputTask').value = ""; //clear input

                    takeJson(); //reload list
                    deleteTask(); //reload click lisnter
                    changeTaskStatus(); //reload click lisnter
                    changeTaskName(); //reload click lisnter

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
                /*
                Adding new task on page
                 */
                /*
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

                document.getElementById('inputTask').value = ""; //clear input
                takeJson(); //reload list
                */

            }
        })
    })
}