import {
  Box,
  ButtonDropdown,
  Container,
  Header,
  Pagination,
  SpaceBetween,
  Table,
} from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import axiosBase from "../../../../api/axios";
import { useCollection } from "@cloudscape-design/collection-hooks";
import ModalAutorDocente from "./components/modalAutorDocente";
import ModalAutorEstudiante from "./components/modalAutorEstudiante";
import ModalAutorExterno from "./components/modalAutorExterno";
import ModalEliminarAutor from "./components/modalEliminarAutor";
import ModalEditarAutor from "./components/modalEditarAutor";

const columnDefinitions = [
  {
    id: "presentado",
    header: "Presentado",
    cell: (item) => item.presentado,
  },
  {
    id: "categoria",
    header: "Categoría",
    cell: (item) => item.categoria,
  },
  {
    id: "autor",
    header: "Nombre en la publicación",
    cell: (item) => item.autor,
  },
  {
    id: "tipo",
    header: "Tipo",
    cell: (item) => item.tipo,
  },
  {
    id: "nombres",
    header: "Nombres",
    cell: (item) => item.nombres,
  },
  {
    id: "filiacion",
    header: "Filiación",
    cell: (item) => item.filiacion,
  },
];

const columnDisplay = [
  { id: "presentado", visible: true },
  { id: "categoria", visible: true },
  { id: "autor", visible: true },
  { id: "tipo", visible: true },
  { id: "nombres", visible: true },
  { id: "filiacion", visible: true },
];

export default function ({ publicacion_id, tipo }) {
  //  State
  const [loading, setLoading] = useState(true);
  const [distributions, setDistribution] = useState([]);
  const [visible, setVisible] = useState(false);
  const [typeModal, setTypeModal] = useState(null);
  const [optAutor, setOptAutor] = useState([]);

  //  Hooks
  const { items, collectionProps, paginationProps } = useCollection(
    distributions,
    {
      pagination: { pageSize: 10 },
      sorting: { defaultState: { sortingColumn: columnDefinitions[0] } },
      selection: {},
    }
  );

  //  Function
  const getData = async () => {
    setLoading(true);
    const res = await axiosBase.get(
      "investigador/publicaciones/listarAutores",
      {
        params: {
          publicacion_id: publicacion_id,
        },
      }
    );
    const data = res.data;
    setDistribution(data);
    setLoading(false);
  };

  //  Effect
  useEffect(() => {
    if (tipo == "articulo") {
      setOptAutor([{ value: "Autor" }, { value: "Autor de correspondencia" }]);
    } else {
    }
    getData();
  }, []);

  return (
    <Container>
      <Table
        {...collectionProps}
        trackBy="id"
        items={items}
        columnDefinitions={columnDefinitions}
        columnDisplay={columnDisplay}
        loading={loading}
        loadingText="Cargando datos"
        resizableColumns
        enableKeyboardNavigation
        selectionType="single"
        variant="embedded"
        header={
          <Header
            counter={"(" + distributions.length + ")"}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <ButtonDropdown
                  disabled={
                    collectionProps.selectedItems.length > 0 ? false : true
                  }
                  variant="normal"
                  onItemClick={({ detail }) => {
                    if (detail.id == "action_1_1") {
                      setTypeModal("edit");
                      setVisible(true);
                    } else if (detail.id == "action_1_2") {
                      setTypeModal("delete");
                      setVisible(true);
                    }
                  }}
                  items={[
                    {
                      text: "Editar",
                      id: "action_1_1",
                    },
                    {
                      text: "Eliminar",
                      id: "action_1_2",
                      disabled: collectionProps.selectedItems[0]?.presentado,
                    },
                  ]}
                >
                  Acciones
                </ButtonDropdown>
                <ButtonDropdown
                  variant="primary"
                  onItemClick={({ detail }) => {
                    if (detail.id == "action_2_1") {
                      setTypeModal("add_docente");
                      setVisible(true);
                    } else if (detail.id == "action_2_2") {
                      setTypeModal("add_estudiante");
                      setVisible(true);
                    } else if (detail.id == "action_2_3") {
                      setTypeModal("add_externo");
                      setVisible(true);
                    }
                  }}
                  items={[
                    {
                      text: "Docente",
                      id: "action_2_1",
                    },
                    {
                      text: "Estudiante",
                      id: "action_2_2",
                    },
                    {
                      text: "Externo",
                      id: "action_2_3",
                    },
                  ]}
                >
                  Agregar autor
                </ButtonDropdown>
              </SpaceBetween>
            }
          >
            Autores de la publicación
          </Header>
        }
        pagination={<Pagination {...paginationProps} />}
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>No hay registros...</b>
            </SpaceBetween>
          </Box>
        }
      />
      {visible && typeModal == "add_docente" && (
        <ModalAutorDocente
          id={publicacion_id}
          reload={getData}
          setVisible={setVisible}
          visible={visible}
          optAutor={optAutor}
        />
      )}
      {visible && typeModal == "add_estudiante" && (
        <ModalAutorEstudiante
          id={publicacion_id}
          reload={getData}
          setVisible={setVisible}
          visible={visible}
          optAutor={optAutor}
        />
      )}
      {visible && typeModal == "add_externo" && (
        <ModalAutorExterno
          id={publicacion_id}
          reload={getData}
          setVisible={setVisible}
          visible={visible}
          optAutor={optAutor}
        />
      )}
      {visible && typeModal == "edit" && (
        <ModalEditarAutor
          item={collectionProps.selectedItems[0]}
          reload={getData}
          setVisible={setVisible}
          visible={visible}
          optAutor={optAutor}
        />
      )}
      {visible && typeModal == "delete" && (
        <ModalEliminarAutor
          id={collectionProps.selectedItems[0].id}
          reload={getData}
          setVisible={setVisible}
          visible={visible}
        />
      )}
    </Container>
  );
}
