<?php

namespace App\Models;

use App\Config\Database;
use App\Models\Afiliado;

class Proyecto {
  public int $idProyecto;
  public string $tipo;
  public float $monto;
  public string $idGrupo; // Id Grupo del usuario
  public int $idAfiliado;
  public string $estado;
  public string $motivo;
  public string $fechaCreacion;
  public int $idUsuario; // Id del usuario que creó el proyecto
  public function __construct($idProyecto = null) {
    if ($idProyecto != null) {
      $sql = "SELECT * FROM tblProyecto WHERE idProyecto = $idProyecto";
      $con = Database::getInstace();
      $stmt = $con->prepare($sql);
      $stmt->execute([]);
      $proyectoData = $stmt->fetch(); // Utiliza fetch en lugar de fetchAll
      if ($proyectoData) {
        $this->idProyecto = $proyectoData['idProyecto'];
        $this->motivo = $proyectoData['motivo'];
        $this->tipo = $proyectoData['tipo'];
        $this->monto = $proyectoData['monto'];
        $this->idGrupo = $proyectoData['idGrupo'];
        $this->idAfiliado = $proyectoData['idAfiliado'];
        $this->estado = $proyectoData['estado'];
        $this->fechaCreacion = $proyectoData['fechaCreacion'];
        $this->idUsuario = $proyectoData['idUsuario'];
      } else {
        $this->objectNull();
      }
    } else {
      $this->objectNull();
    }
  }
  public function objectNull() {
    $this->idProyecto = 0;
    $this->motivo = '';
    $this->tipo = '';
    $this->monto = 0.0;
    $this->idGrupo = '';
    $this->idAfiliado = 0;
    $this->estado = '';
    $this->fechaCreacion = '';
    $this->idUsuario = 1;
  }
  public static function getAll($estado, $idGrupo) {
    $con = Database::getInstace();
    $sql = $estado == "all" ?
      "SELECT tp.*, ta.nombre, tu.alias FROM tblProyecto tp 
      INNER JOIN tblAfiliado ta ON tp.idAfiliado = ta.idAfiliado
      INNER JOIN tblUsuario tu ON tp.idUsuario = tu.idUsuario
      WHERE tp.idGrupo = $idGrupo;"
      : "SELECT tp.*, ta.nombre, tu.alias FROM tblProyecto tp 
      INNER JOIN tblAfiliado ta ON tp.idAfiliado = ta.idAfiliado
      INNER JOIN tblUsuario tu ON tp.idUsuario = tu.idUsuario
      WHERE tp.estado LIKE '$estado' AND tp.idGrupo = $idGrupo;";
    $stmt = $con->prepare($sql);
    $stmt->execute([]);
    $arrayProyectos = array();
    foreach ($stmt->fetchAll() as $proy) {
      $arrayProyectos[] = $proy;
    }
    return $arrayProyectos;
  }
  public static function facade($proy): Proyecto {
    $new = new Proyecto();
    $new->idProyecto = $proy['idProyecto'];
    $new->motivo = $proy['motivo'];
    $new->tipo = $proy['tipo'];
    $new->monto = $proy['monto'];
    $new->idGrupo = $proy['idGrupo'];
    $new->idAfiliado = $proy['idAfiliado'];
    $new->estado = $proy['estado'];
    $new->fechaCreacion = $proy['fechaCreacion'];
    return $new;
  }

  public function save() {
    $res = -1;
    try {
      $con = Database::getInstace();
      if ($this->idProyecto == 0) { //insert
        $sql = "INSERT INTO tblProyecto(tipo, monto, motivo, idGrupo, idAfiliado, estado, idUsuario) VALUES(?, ?, ?, ?, ?, ?, ?);";
        $params = [$this->tipo, $this->monto, $this->motivo, $this->idGrupo, $this->idAfiliado, $this->estado, $this->idUsuario];
        $stmt = $con->prepare($sql);
        $res = $stmt->execute($params);
        if ($res) {
          $this->idProyecto = $con->lastInsertId();
          $res = $this->idProyecto;
        }
      } else { // update
        $sql = "UPDATE tblProyecto SET tipo = ?, monto = ?, motivo = ?, idGrupo = ?, idAfiliado = ?, estado = ? WHERE idProyecto = ?";
        $params = [$this->tipo, $this->monto, $this->motivo, $this->idGrupo, $this->idAfiliado, $this->estado, $this->idProyecto];
        $stmt = $con->prepare($sql);
        $res = $stmt->execute($params);
        if (!$res) {
          $res = -1;
        }
      }
    } catch (\Throwable $th) {
      print_r($th);
    }
    return $res;
  }

  public function afiliado(): Afiliado {
    $afiliado = new Afiliado($this->idAfiliado);
    return $afiliado;
  }
  public function delete() {
    $con = Database::getInstace();
    $sql = "DELETE FROM tblProyecto WHERE idProyecto = ?;";
    $params = [$this->idProyecto];
    $stmt = $con->prepare($sql);
    return $stmt->execute($params);
  }
}
