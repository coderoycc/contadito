var audio = null;
var imagen = null;
$(document).ready(function () {
})



// ocultamos la sugerencia por el ID
function ocultarSugerencias(idSugg) {
  $("#" + idSugg).hide();
}
function mostrarSugerenciasProyecto(arraySuggestions, idSugg, input_id) {
  $suggestions = $("#" + idSugg);
  $suggestions.empty();
  if (arraySuggestions.length > 0) {
    $.each(arraySuggestions, function (_, sugerencia) {
      $("<li>").attr('data-exist', 1).attr('data-idinput', input_id).attr('data-idproyecto', sugerencia.idProyecto).text(sugerencia.proyecto).appendTo($suggestions);
    });
  } else {
    if ($(`#${input_id}`).val().length > 2) {
      $("<li>").attr('data-exist', 0).attr('data-idinput', input_id).html($("#" + input_id).val() + '<button type="button" class="btn btn-success btn-sm float-end" onclick="agregarProyecto()"><i class="fa fa-plus"></i></button>').appendTo($suggestions);
    }
  }
  $suggestions.show();
}

function mostrarSugerenciasAfiliado(arraySuggestions, idSugg, input_id) {
  $suggestions = $("#" + idSugg);
  $suggestions.empty();
  if (arraySuggestions.length > 0) {
    $.each(arraySuggestions, function (_, sugerencia) {
      $("<li>").attr('data-exist', 1).attr('data-idinput', input_id).attr('data-idafiliado', sugerencia.idAfiliado).text(sugerencia.nombre.toUpperCase()).appendTo($suggestions);
    });
  } else {
    if ($(`#${input_id}`).val().length > 2) {
      $("<li>").attr('data-exist', 0).attr('data-idinput', input_id).html($("#" + input_id).val() + '<button type="button" class="btn btn-success btn-sm float-end" onclick="agregarAfiliado()"><i class="fa fa-plus"></i></button>').appendTo($suggestions);
    }
  }
  $suggestions.show();
}

$(document).on('input', '#tipo_detalle', async (e) => {
  $input = $("#tipo_detalle");
  var valorInput = $input.val().toLowerCase();
  if (valorInput.length < 3) {
    ocultarSugerencias('suggestion_proy');
    return;
  }
  var res = await $.ajax({
    url: '../app/cproyecto/search',
    type: 'GET',
    dataType: 'json',
    data: { q: valorInput }
  })
  console.log(res)
  console.log(JSON.parse(res.data))
  if (res.status == 'success') {
    mostrarSugerenciasProyecto(JSON.parse(res.data), 'suggestion_proy', 'tipo_detalle');
  }
})
$(document).on('input', '#afiliado_to', async (e) => {
  $input = $("#afiliado_to");
  var valorInput = $input.val().toLowerCase();
  if (valorInput.length < 2) {
    ocultarSugerencias('suggestions_afiliado');
    return;
  }
  var res = await $.ajax({
    url: '../app/cafiliado/suggestionAfiliado',
    type: 'GET',
    dataType: 'json',
    data: { q: valorInput }
  })
  console.log(res)
  console.log(JSON.parse(res.data))
  if (res.status == 'success') {
    mostrarSugerenciasAfiliado(JSON.parse(res.data), 'suggestions_afiliado', 'afiliado_to');
  }
});
$(document).on('click', '#suggestion_proy li', (e) => {
  $val = $(e.target);
  if (e.target.tagName == 'LI') {
    if ($val.data('exist') == 1) {
      $("#" + $val.data('idinput')).val($val.text().toUpperCase());
      $("#idProyecto").val($val.data('idproyecto'));
      ocultarSugerencias('suggestion_proy');
    } else {
      $.toast({
        heading: '<b>No existe el proyecto</b>',
        text: 'Agrégalo haciendo click en el boton verde',
        icon: 'warning',
        position: 'top-right',
        stack: 2,
        hideAfter: 2500
      })
    }
  }
})

$(document).on('click', '#suggestions_afiliado li', (e) => {
  $val = $(e.target);
  if (e.target.tagName == 'LI') {
    if ($val.data('exist') == 1) {
      $("#" + $val.data('idinput')).val($val.text().toUpperCase());
      $("#idAfiliado").val($val.data('idafiliado'));
      ocultarSugerencias('suggestions_afiliado');
    } else {
      $.toast({
        heading: '<b>No existe el afiliado</b>',
        text: 'Agrégalo haciendo click en el boton verde',
        icon: 'warning',
        position: 'top-right',
        stack: 2,
        hideAfter: 2800
      })
    }
  }
})

$(document).on("click", function (event) {
  // verificamos si se hizo click en otra parte
  $input = $("#afiliado");
  // input id
  $suggestions = $("#suggestions_afiliado");
  if (!$(event.target).closest($input).length && !$(event.target).closest($suggestions).length) {
    ocultarSugerencias('suggestions_afiliado');
  }
  $input = $("#tipo_detalle");
  // input id
  $suggestions = $("#suggestion_proy");
  if (!$(event.target).closest($input).length && !$(event.target).closest($suggestions).length) {
    ocultarSugerencias('suggestion_proy');
  }
});

async function agregarProyecto() {
  const proyecto = $("#tipo_detalle").val()
  const res = await $.ajax({
    url: '../app/cproyecto/create',
    type: 'POST',
    dataType: 'json',
    data: { proyecto, tipo: 'EGRESO' }
  })
  if (res.status == 'success') {
    $.toast({
      heading: 'Operación exitosa',
      text: 'Agregado correctamente',
      icon: 'success',
      position: 'top-right',
      stack: 2,
      hideAfter: 1550
    })
    $("#tipo_detalle").val(proyecto.toUpperCase());
    const data = JSON.parse(res.proyecto);
    $("#idProyecto").val(data.idProyecto)
    ocultarSugerencias('suggestion_proy');
  } else {
    $.toast({
      heading: 'Ocurrió un error',
      text: 'No se pudo agregar el proyecto',
      icon: 'danger',
      position: 'top-right',
      stack: 2,
      hideAfter: 2000
    })
  }
}
async function agregarAfiliado() {
  const nombre = $("#afiliado_to").val()
  const res = await $.ajax({
    url: '../app/cafiliado/create',
    type: 'GET',
    dataType: 'json',
    data: { nombre }
  })
  if (res.status == 'success') {
    $.toast({
      heading: 'Operación exitosa',
      text: 'Agregado correctamente',
      icon: 'success',
      position: 'top-right',
      stack: 2,
      hideAfter: 1550
    })
    $("#afiliado_to").val(nombre);
    const afiliado = JSON.parse(res.afiliado);
    $("#idAfiliado").val(afiliado.idAfiliado)
    ocultarSugerencias('suggestions_afiliado');
  } else {
    $.toast({
      heading: 'Ocurrió un error',
      text: 'No se pudo agregar al usuario',
      icon: 'danger',
      position: 'top-right',
      stack: 2,
      hideAfter: 2000
    })
  }
}
$(document).on('submit', '#form_nuevo', async (e) => {
  e.preventDefault();
  const data = $(e.target).serializeArray();
  let formData = new FormData();
  $.each(data, (_, e) => {
    formData.append(e.name, e.value)
  });
  if (imagen != null) formData.append('imagen', imagen);
  if (audio != null) formData.append('audio', audio);
  const res = await $.ajax({
    url: '../app/cpago/create',
    data: formData,
    contentType: false,
    processData: false,
    type: 'POST',
    dataType: 'json'
  });
  if (res.status == 'success') {
    $.toast({
      heading: '<b>PAGO AGREGADO</b>',
      text: 'Se agregó el pago exitosamente',
      icon: 'success',
      position: 'top-right',
      stack: 3,
      hideAfter: 1500
    });
    setTimeout(() => {
      // window.location.href = './';
    }, 1500);
  } else {
    $.toast({
      heading: '<b>OCURRIÓ UN ERROR</b>',
      text: 'No se pudo agregar el pago',
      icon: 'danger',
      position: 'top-right',
      stack: 2,
      hideAfter: 2800
    })
  }
})
$(document).on('click', '.type-comp', (e) => {
  $.each($('.type-comp'), function (_, type) {
    $(type).removeClass('active');
  })
  $(e.currentTarget).addClass('active');

  const tipo = e.currentTarget.dataset.tipo;
  if (tipo == 'img') {
    $("#cont_comprobante").html(`
      <div class="row justify-content-center m-3">
        <div class="image-container" >
          <img id="img_comprobante" src="../assets/img/empty.jpg" alt="Upload image" />
        </div>
        <div>
          <input type="file" class="form-control mt-2" name="file" id="file_comprobante" accept="image/*">
        </div>
      </div>
    `);
    handlerImage('img_comprobante', 'file_comprobante', 'type_file_upload')
  } else if (tipo == 'audio') {
    $("#cont_comprobante").html(`
      <div class="row justify-content-center m-3">
        <div class="d-flex justify-content-center">
          <i id="recordButton" class="fa fa-microphone"></i>
        </div>
        <p id="recordingTime" class="text-center">Tiempo de: 00:00</p>
      </div>
    `);
    handlerAudio('recordButton', 'type_file_upload');
  } else {
    $("#cont_comprobante").html(`
    <h5 class="text-center mt-2">Dibuja tu firma</h5>
    <div class="canvas_firma">
      <canvas id="draw_picture"></canvas>
    </div>
    <button type="button" id="btn_clean_firma" class="btn btn-danger float-end mt-3"><i class="fa-solid fa-eraser"></i> Limpiar</button>
    <button type="button" id="btn_terminar_firma" class="btn btn-primary float-end mt-3 me-3">Terminar</button>`);
    const hand = new HandlerFirma();
    hand.clean_draw();
    console.log(hand)
    $("#btn_clean_firma").on('click', () => {
      hand.clean_draw();
    });
    $("#btn_terminar_firma").on('click', () => {
      imagen = hand.save_draw();
      $("#type_file_upload").val('imagen')
      $("#btn_clean_firma").attr('disabled', true);
      $("#modal_egreso_comprobante").modal('hide')
      adjuntarArch();
    })
  }

})

$("#modal_egreso_comprobante").on('hide.bs.modal', () => {
  $.each($('.type-comp'), function (_, type) {
    $(type).removeClass('active');
    $(type).attr('disabled', false);
  })
  $("#cont_comprobante").html('')
})

function adjuntarArch() {
  if (audio == null && imagen == null) {
    return;
  }
  $('#btn_file_upload').html('<i class="fa fa-paperclip"></i>')
  $('#btn_file_upload').removeClass('btn-primary');
  $('#btn_file_upload').addClass('btn-secondary');
  $('#btn_file_upload').attr('disabled', true);
  $("#comprobante_pago_file").html(`Archivo de tipo <i>${$("#type_file_upload").val()}</i> adjunto`)
}