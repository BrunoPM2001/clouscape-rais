import {
  Badge,
  Box,
  Button,
  Header,
  Pagination,
  PropertyFilter,
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
    propertyLabel: "Nombre de grupo",
    key: "grupo_nombre",
    groupValuesLabel: "Nombres de grupo",
    operators: stringOperators,
  },
  {
    propertyLabel: "Nombre corto",
    key: "grupo_nombre_corto",
    groupValuesLabel: "Nombres cortos",
    operators: stringOperators,
  },
  {
    propertyLabel: "Categoría",
    key: "grupo_categoria",
    groupValuesLabel: "Categorías",
    operators: stringOperators,
  },
  {
    propertyLabel: "Facultad",
    key: "facultad",
    groupValuesLabel: "Facultades",
    operators: stringOperators,
  },
  {
    propertyLabel: "Coordinador",
    key: "coordinador",
    groupValuesLabel: "Coordinadores",
    operators: stringOperators,
  },
  {
    propertyLabel: "Integrantes",
    key: "cantidad_integrantes",
    groupValuesLabel: "Cantidades",
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
    id: "grupo_nombre",
    header: "Nombre de grupo",
    cell: (item) => item.grupo_nombre,
    sortingField: "grupo_nombre",
  },
  {
    id: "grupo_nombre_corto",
    header: "Nombre corto",
    cell: (item) => item.grupo_nombre_corto,
    sortingField: "grupo_nombre_corto",
  },
  {
    id: "grupo_categoria",
    header: "Categoría",
    cell: (item) => item.grupo_categoria,
    sortingField: "grupo_categoria",
  },
  {
    id: "facultad",
    header: "Facultad",
    cell: (item) => item.facultad,
    sortingField: "facultad",
  },
  {
    id: "coordinador",
    header: "Coordinador",
    cell: (item) => item.coordinador,
    sortingField: "coordinador",
  },
  {
    id: "cantidad_integrantes",
    header: "Integrantes",
    cell: (item) => item.cantidad_integrantes,
    sortingField: "coordinador",
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
          : "No aprobado"}
      </Badge>
    ),
    sortingField: "estado",
  },
];

const columnDisplay = [
  { id: "id", visible: true },
  { id: "grupo_nombre", visible: true },
  { id: "grupo_nombre_corto", visible: true },
  { id: "grupo_categoria", visible: true },
  { id: "facultad", visible: true },
  { id: "coordinador", visible: true },
  { id: "cantidad_integrantes", visible: true },
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
  const [enableBtn, setEnableBtn] = useState(true);

  //  Functions
  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:8000/api/admin/estudios/grupos/listadoSolicitudes"
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
    if (selectedItems.length > 0) {
      setEnableBtn(true);
    } else {
      setEnableBtn(false);
    }
  }, [selectedItems]);

  const navigate = useNavigate();

  return (
    <>
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
        onSelectionChange={({ detail }) =>
          setSelectedItems(detail.selectedItems)
        }
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
            Solicitudes de grupos de investigación
          </Header>
        }
        filter={
          <PropertyFilter
            {...propertyFilterProps}
            filteringPlaceholder="Buscar solicitud"
            countText={`${filteredItemsCount} coincidencias`}
            expandToViewport
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
      ></Table>
    </>
  );
};
