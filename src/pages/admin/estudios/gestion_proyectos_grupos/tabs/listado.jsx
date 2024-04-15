import {
  Badge,
  Box,
  Button,
  FormField,
  Header,
  Pagination,
  PropertyFilter,
  Select,
  SpaceBetween,
  Table,
} from "@cloudscape-design/components";
import { useState, useEffect } from "react";
import { useCollection } from "@cloudscape-design/collection-hooks";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";

const stringOperators = [":", "!:", "=", "!=", "^", "!^"];

const FILTER_PROPS = [
  {
    propertyLabel: "ID",
    key: "id",
    groupValuesLabel: "IDS",
    operators: stringOperators,
  },
  {
    propertyLabel: "Tipo de proyecto",
    key: "tipo_proyecto",
    groupValuesLabel: "Tipos de proyectos",
    operators: stringOperators,
  },
  {
    propertyLabel: "Código",
    key: "codigo_proyecto",
    groupValuesLabel: "Códigos",
    operators: stringOperators,
  },
  {
    propertyLabel: "Línea",
    key: "linea",
    groupValuesLabel: "Líneas",
    operators: stringOperators,
  },
  {
    propertyLabel: "Título",
    key: "titulo",
    groupValuesLabel: "Títulos",
    operators: stringOperators,
  },
  {
    propertyLabel: "Responsable",
    key: "responsable",
    groupValuesLabel: "Coordinadores",
    operators: stringOperators,
  },
  {
    propertyLabel: "Nombre del grupo",
    key: "grupo_nombre",
    groupValuesLabel: "Nombres de los grupos",
    operators: stringOperators,
  },
  {
    propertyLabel: "Facultad",
    key: "facultad",
    groupValuesLabel: "Facultades",
    operators: stringOperators,
  },
  {
    propertyLabel: "Monto",
    key: "monto",
    groupValuesLabel: "Montos",
    operators: stringOperators,
  },
  {
    propertyLabel: "R.R",
    key: "resolucion_rectoral",
    groupValuesLabel: "Resoluciones",
    operators: stringOperators,
  },
  {
    propertyLabel: "Estado",
    key: "estado",
    groupValuesLabel: "Estados",
    operators: stringOperators,
  },
];

const columnDefinitions = [
  {
    id: "id",
    header: "ID",
    cell: (item) => item.id,
    sortingField: "id",
    isRowHeader: true,
  },
  {
    id: "tipo_proyecto",
    header: "Tipo de proyecto",
    cell: (item) => item.tipo_proyecto,
    sortingField: "tipo_proyecto",
  },
  {
    id: "codigo_proyecto",
    header: "Código",
    cell: (item) => item.codigo_proyecto,
    sortingField: "codigo_proyecto",
  },
  {
    id: "linea",
    header: "Línea",
    cell: (item) => item.linea,
    sortingField: "linea",
  },
  {
    id: "titulo",
    header: "Título",
    cell: (item) => item.titulo,
    sortingField: "titulo",
  },
  {
    id: "responsable",
    header: "Responsable",
    cell: (item) => item.responsable,
    sortingField: "responsable",
  },
  {
    id: "grupo_nombre",
    header: "Nombre del grupo",
    cell: (item) => item.grupo_nombre,
    sortingField: "grupo_nombre",
  },
  {
    id: "facultad",
    header: "Facultad",
    cell: (item) => item.facultad,
    sortingField: "facultad",
  },
  {
    id: "monto",
    header: "Monto",
    cell: (item) => item.monto,
    sortingField: "monto",
  },
  {
    id: "resolucion_rectoral",
    header: "R.R",
    cell: (item) => item.resolucion_rectoral,
    sortingField: "resolucion_rectoral",
  },
  {
    id: "estado",
    header: "Estado",
    cell: (item) => (
      <Badge
        color={
          item.estado == -1
            ? "red"
            : item.estado == 1
            ? "grey"
            : item.estado == 2
            ? "grey"
            : item.estado == 4
            ? "green"
            : item.estado == 5
            ? "blue"
            : item.estado == 6
            ? "grey"
            : "red"
        }
      >
        {item.estado == -1
          ? "Eliminado"
          : item.estado == 1
          ? "Reconocido"
          : item.estado == 2
          ? "Observado"
          : item.estado == 4
          ? "Registrado"
          : item.estado == 5
          ? "Enviado"
          : item.estado == 6
          ? "En proceso"
          : "Error"}
      </Badge>
    ),
    sortingField: "estado",
  },
];

const columnDisplay = [
  { id: "id", visible: true },
  { id: "tipo_proyecto", visible: true },
  { id: "codigo_proyecto", visible: true },
  { id: "linea", visible: true },
  { id: "titulo", visible: true },
  { id: "responsable", visible: true },
  { id: "grupo_nombre", visible: true },
  { id: "facultad", visible: true },
  { id: "monto", visible: true },
  { id: "resolucion_rectoral", visible: true },
  { id: "estado", visible: true },
];

export default () => {
  //  Data states
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [distributions, setDistribution] = useState([]);
  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    paginationProps,
    propertyFilterProps,
  } = useCollection(distributions, {
    propertyFiltering: {
      filteringProperties: FILTER_PROPS,
      empty: (
        <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
          <SpaceBetween size="m">
            <b>No hay registros...</b>
          </SpaceBetween>
        </Box>
      ),
      noMatch: (
        <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
          <SpaceBetween size="m">
            <b>No hay coincidencias</b>
          </SpaceBetween>
        </Box>
      ),
    },
    pagination: { pageSize: 10 },
    sorting: { defaultState: { sortingColumn: columnDefinitions[0] } },
    selection: {},
  });
  const [selectedOption, setSelectedOption] = useState({
    value: "2024",
  });
  const [enableBtn, setEnableBtn] = useState(true);

  //  Functions
  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:8000/api/admin/estudios/proyectosGrupo/listado/" +
          selectedOption.value
      );
      if (!res.ok) {
        setDistribution([]);
        setLoading(false);
        throw new Error("Error in fetch");
      } else {
        const data = await res.json();
        setDistribution(data.data);
        setLoading(false);
      }
    } catch (error) {
      setDistribution([]);
      setLoading(false);
      console.log(error);
    }
  };

  //  Effects
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [selectedOption]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      setEnableBtn(true);
    } else {
      setEnableBtn(false);
    }
  }, [selectedItems]);

  const navigate = useNavigate();

  return (
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
      selectedItems={selectedItems}
      onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
      header={
        <Header
          counter={
            selectedItems.length
              ? "(" + selectedItems.length + "/" + items.length + ")"
              : "(" + items.length + ")"
          }
          actions={
            <Button
              disabled={!enableBtn}
              variant="primary"
              onClick={() => {
                const query = queryString.stringify({
                  id: selectedItems[0]["id"],
                });
                navigate("detalle?" + query);
              }}
            >
              Visualizar
            </Button>
          }
        >
          Proyectos de grupos de investigación
        </Header>
      }
      filter={
        <PropertyFilter
          {...propertyFilterProps}
          filteringPlaceholder="Buscar proyecto de grupo"
          countText={`${filteredItemsCount} coincidencias`}
          expandToViewport
          customControl={
            <FormField label="Año:">
              <Select
                expandToViewport
                selectedOption={selectedOption}
                onChange={({ detail }) =>
                  setSelectedOption(detail.selectedOption)
                }
                options={[
                  { value: "2024" },
                  { value: "2023" },
                  { value: "2022" },
                  { value: "2021" },
                  { value: "2020" },
                  { value: "2019" },
                  { value: "2018" },
                ]}
              />
            </FormField>
          }
        />
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
  );
};