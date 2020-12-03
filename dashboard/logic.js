$(document).ready(function() {
      
var filaEliminada; //para capturara la fila eliminada
var filaEditada; //para capturara la fila editada o actualizada


//creamos constantes para los iconos editar y borrar    
const iconoEditar = '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/></svg>';
const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';


var db = firebase.database();
var coleccionPedidos = db.ref().child("Pedidos");
     
var dataSet = [];//array para guardar los valores de los campos inputs del form
var table = $('#tablapedidos').DataTable({
            language:{
                search:"Buscar: "
                
            },
            pageLength : 5,
            lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
            data: dataSet,
            columnDefs: [
                {
                    targets: [0], 
                    visible: false, //ocultamos la columna de ID que es la [0]                        
                },
                {
                    targets: -1,        
                    defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Finalizar'>"+iconoEditar+"</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>"+iconoBorrar+"</button></div></div>"
                }
            ]	   
        });

coleccionPedidos.on("child_added", datos => {        
    dataSet = [datos.key, datos.child("nombre").val(), datos.child("fecha").val(), datos.child("hora").val(),datos.child("platillo").val(),datos.child("direccion").val(),datos.child("telefono").val()];
    table.rows.add([dataSet]).draw();
});
coleccionPedidos.on('child_changed', datos => {           
    dataSet = [datos.key, datos.child("nombre").val(), datos.child("fecha").val(), datos.child("hora").val(),datos.child("platillo").val(),datos.child("direccion").val(),datos.child("telefono").val()];
    table.row(filaEditada).data(dataSet).draw();
});
coleccionPedidos.on("child_removed", function() {
    table.row(filaEliminada.parents('tr')).remove().draw();                     
});
      
$('form').submit(function(e){                         
    e.preventDefault();
    let id = $.trim($('#id').val());        
    let nombre = $.trim($('#nombre').val());
    let fecha = $.trim($('#fecha').val());  
    let hora = $.trim($('#hora').val());        
    let platillo = $.trim($('#platillo').val());   
    let direccion = $.trim($('#direccion').val()); 
    let telefono = $.trim($('#telefono').val());                               
    let idFirebase = id;        
    if (idFirebase == ''){                      
        idFirebase = coleccionPedidos.push().key;
    };                
    data = {nombre:nombre +'<span class="badge badge-pill badge-success">entregado</span>', fecha:fecha,hora:hora, platillo:platillo, direccion:direccion, telefono:telefono};             
    actualizacionData = {};
    actualizacionData[`/${idFirebase}`] = data;
    coleccionPedidos.update(actualizacionData);
    id = '';        
    $("form").trigger("reset");
    $('#mostrarModal').modal('hide');
});

//Botones
  

$("#tablapedidos").on("click", ".btnEditar", function() {    
    filaEditada = table.row($(this).parents('tr'));           
    let fila = $('#tablapedidos').dataTable().fnGetData($(this).closest('tr'));               
    let id = fila[0];
    console.log(id);
    let nombre = $(this).closest('tr').find('td:eq(0)').text(); 
    let fecha = $(this).closest('tr').find('td:eq(1)').text();
    let hora = $(this).closest('tr').find('td:eq(3)').text();     
    let platillo = $(this).closest('tr').find('td:eq(2)').text();  
    let direccion = $(this).closest('tr').find('td:eq(4)').text(); 
    let telefono = $(this).closest('tr').find('td:eq(5)').text();           
    $('#id').val(id);        
    $('#nombre').val(nombre);
    $('#fecha').val(fecha);  
    $('#hora').val(hora);             
    $('#platillo').val(platillo); 
    $('#direccion').val(direccion);
    $('#telefono').val(telefono);                 
    $('#mostrarModal').modal('show');
});  

$("#tablapedidos").on("click", ".btnBorrar", function() {   
    filaEliminada = $(this);
    Swal.fire({
    title: '¿Está seguro de eliminar el pedido?',
    text: "¡Está operación no se puede revertir!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Borrar'
    }).then((result) => {
    if (result.value) {
        let fila = $('#tablapedidos').dataTable().fnGetData($(this).closest('tr'));            
        let id = fila[0];            
        db.ref(`Pedidos/${id}`).remove()
        Swal.fire('¡Eliminado!', 'El pedido ha sido eliminado.','success')
    }
    })        
});  

});