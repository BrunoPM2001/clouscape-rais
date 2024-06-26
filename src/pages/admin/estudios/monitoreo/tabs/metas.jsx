import {
  Box,
  Button,
  Container,
  Grid,
  Header,
  SpaceBetween,
  Table,
} from "@cloudscape-design/components";
import { useState, useEffect } from "react";
import axiosBase from "../../../../../api/axios";

export default () => {
  //  Data states
  const [loadingPeriodo, setLoadingPeriodo] = useState(true);
  const [loadingTipoProyecto, setLoadingTipoProyecto] = useState(false);
  const [loadingPublicaciones, setLoadingPublicaciones] = useState(false);
  const [metasPeriodo, setMetasPeriodo] = useState([]);
  const [metasTipoProyecto, setMetasTipoProyecto] = useState([]);
  const [metasPublicaciones, setMetasPublicaciones] = useState([]);
  const [selectedPeriodos, setSelectedPeriodos] = useState([]);
  const [selectedTipoProyecto, setSelectedTipoProyecto] = useState([]);
  const [selectedPublicaciones, setSelectedPublicaciones] = useState([]);

  //  Functions
  const getPeriodos = async () => {
    setLoadingPeriodo(true);
    const res = await axiosBase.get("admin/estudios/monitoreo/listadoPeriodos");
    const data = await res.data;
    setMetasPeriodo(data.data);
    setLoadingPeriodo(false);
  };

  const getTiposProyecto = async () => {
    setLoadingTipoProyecto(true);
    const res = await axiosBase.get(
      "admin/estudios/monitoreo/listadoTipoProyectos/" + selectedPeriodos[0].id
    );
    const data = await res.data;
    setMetasTipoProyecto(data.data);
    setLoadingTipoProyecto(false);
  };

  const getPublicaciones = async () => {
    setLoadingPublicaciones(true);
    const res = await axiosBase.get(
      "admin/estudios/monitoreo/listadoPublicaciones/" +
        selectedTipoProyecto[0].id
    );
    const data = await res.data;
    setMetasPublicaciones(data.data);
    setLoadingPublicaciones(false);
  };

  //  Effects
  useEffect(() => {
    getPeriodos();
  }, []);

  useEffect(() => {
    getTiposProyecto();
  }, [selectedPeriodos]);

  useEffect(() => {
    getPublicaciones();
  }, [selectedTipoProyecto]);

  return (
    <Grid
      gridDefinition={[
        {
          colspan: {
            l: 6,
            m: 6,
            s: 6,
            xs: 12,
          },
        },
        {
          colspan: {
            l: 6,
            m: 6,
            s: 6,
            xs: 12,
          },
        },
        {
          colspan: {
            l: 12,
            m: 12,
            s: 12,
            xs: 12,
          },
        },
      ]}
    >
      <Container fitHeight>
        <Table
          variant="embedded"
          columnDefinitions={[
            {
              id: "periodo",
              header: "Periodo",
              cell: (item) => item.periodo,
            },
            {
              id: "estado",
              header: "Estado",
              cell: (item) => item.estado,
            },
            {
              id: "descripcion",
              header: "Descripcion",
              cell: (item) => item.descripcion,
            },
          ]}
          columnDisplay={[
            { id: "periodo", visible: true },
            { id: "estado", visible: true },
            { id: "descripcion", visible: false },
          ]}
          trackBy="id"
          enableKeyboardNavigation
          items={metasPeriodo}
          loadingText="Cargando datos"
          loading={loadingPeriodo}
          resizableColumns
          selectionType="single"
          selectedItems={selectedPeriodos}
          onSelectionChange={({ detail }) =>
            setSelectedPeriodos(detail.selectedItems)
          }
          onRowClick={({ detail }) => setSelectedPeriodos([detail.item])}
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No hay registros...</b>
              </SpaceBetween>
            </Box>
          }
          header={
            <Header
              variant="h3"
              actions={
                <Button
                  variant="primary"
                  onClick={() => console.log("clicked")}
                >
                  Agregar periodo
                </Button>
              }
            >
              Periodos
            </Header>
          }
        />
      </Container>
      <Container fitHeight>
        <Table
          variant="embedded"
          columnDefinitions={[
            {
              id: "tipo_proyecto",
              header: "Tipo de proyecto",
              cell: (item) => item.tipo_proyecto,
            },
            {
              id: "estado",
              header: "Estado",
              cell: (item) => item.estado,
            },
          ]}
          columnDisplay={[
            { id: "tipo_proyecto", visible: true },
            { id: "estado", visible: true },
          ]}
          trackBy="id"
          enableKeyboardNavigation
          items={metasTipoProyecto}
          loadingText="Cargando datos"
          loading={loadingTipoProyecto}
          resizableColumns
          selectionType="single"
          selectedItems={selectedTipoProyecto}
          onSelectionChange={({ detail }) =>
            setSelectedTipoProyecto(detail.selectedItems)
          }
          onRowClick={({ detail }) => setSelectedTipoProyecto([detail.item])}
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No hay registros...</b>
              </SpaceBetween>
            </Box>
          }
          header={
            <Header
              variant="h3"
              actions={
                <Button
                  variant="primary"
                  onClick={() => console.log("clicked")}
                >
                  Agregar proyecto
                </Button>
              }
            >
              Tipos de proyecto
            </Header>
          }
        />
      </Container>
      <Table
        columnDefinitions={[
          {
            id: "tipo_publicacion",
            header: "Tipo de publicacion",
            cell: (item) => item.tipo_publicacion,
          },
          {
            id: "cantidad",
            header: "Cantidad",
            cell: (item) => item.cantidad,
          },
          {
            id: "estado",
            header: "Estado",
            cell: (item) => item.estado,
          },
        ]}
        columnDisplay={[
          { id: "tipo_publicacion", visible: true },
          { id: "cantidad", visible: true },
          { id: "estado", visible: true },
        ]}
        trackBy="id"
        enableKeyboardNavigation
        items={metasPublicaciones}
        loadingText="Cargando datos"
        loading={loadingPublicaciones}
        resizableColumns
        selectionType="single"
        selectedItems={selectedPublicaciones}
        onSelectionChange={({ detail }) =>
          setSelectedPublicaciones(detail.selectedItems)
        }
        onRowClick={({ detail }) => setSelectedPublicaciones([detail.item])}
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>No hay registros...</b>
            </SpaceBetween>
          </Box>
        }
        header={
          <Header
            variant="h3"
            actions={
              <Button variant="primary" onClick={() => console.log("clicked")}>
                Agregar meta
              </Button>
            }
          >
            Publicaciones
          </Header>
        }
      />
    </Grid>
  );
};
