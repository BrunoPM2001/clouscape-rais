import {
  Autosuggest,
  Badge,
  Box,
  Button,
  ButtonDropdown,
  FormField,
  Header,
  Pagination,
  PropertyFilter,
  SpaceBetween,
  Table,
} from "@cloudscape-design/components";
import { useState, useEffect } from "react";
import { useCollection } from "@cloudscape-design/collection-hooks";
import axiosBase from "../../../../../api/axios";
import { useAutosuggest } from "../../../../../hooks/useAutosuggest";
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
    propertyLabel: "Código de registro",
    key: "codigo_registro",
    groupValuesLabel: "Códigos de registro",
    operators: stringOperators,
  },
  {
    propertyLabel: "Tipo",
    key: "tipo",
    groupValuesLabel: "Tipos",
    operators: stringOperators,
  },
  {
    propertyLabel: "Isbn",
    key: "isbn",
    groupValuesLabel: "Isbns",
    operators: stringOperators,
  },
  {
    propertyLabel: "Issn",
    key: "issn",
    groupValuesLabel: "Issns",
    operators: stringOperators,
  },
  {
    propertyLabel: "Editorial",
    key: "editorial",
    groupValuesLabel: "Editoriales",
    operators: stringOperators,
  },
  {
    propertyLabel: "Nombre de evento",
    key: "evento_nombre",
    groupValuesLabel: "Nombres de eventos",
    operators: stringOperators,
  },
  {
    propertyLabel: "Título",
    key: "titulo",
    groupValuesLabel: "Títulos",
    operators: stringOperators,
  },
  {
    propertyLabel: "Fecha de publicación",
    key: "fecha_publicacion",
    groupValuesLabel: "Fechas",
    operators: stringOperators,
  },
  {
    propertyLabel: "Estado",
    key: "estado",
    groupValuesLabel: "Estados",
    operators: stringOperators,
  },
  {
    propertyLabel: "Procedencia",
    key: "procedencia",
    groupValuesLabel: "Procedencias",
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
    id: "codigo_registro",
    header: "Código de registro",
    cell: (item) => item.codigo_registro,
    sortingField: "codigo_registro",
  },
  {
    id: "codigo_proyecto",
    header: "Código",
    cell: (item) => item.codigo_proyecto,
    sortingField: "codigo_proyecto",
  },
  {
    id: "tipo",
    header: "Tipo",
    cell: (item) => item.tipo,
    sortingField: "tipo",
  },
  {
    id: "isbn",
    header: "Isbn",
    cell: (item) => item.isbn,
    sortingField: "isbn",
  },
  {
    id: "issn",
    header: "Issn",
    cell: (item) => item.issn,
    sortingField: "issn",
  },
  {
    id: "editorial",
    header: "Editorial",
    cell: (item) => item.editorial,
    sortingField: "editorial",
  },
  {
    id: "evento_nombre",
    header: "Nombre de evento",
    cell: (item) => item.evento_nombre,
    sortingField: "evento_nombre",
  },
  {
    id: "titulo",
    header: "Título",
    cell: (item) => item.titulo,
    sortingField: "titulo",
  },
  {
    id: "fecha_publicacion",
    header: "Fecha de publicación",
    cell: (item) => item.fecha_publicacion,
    sortingField: "fecha_publicacion",
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
            ? "green"
            : item.estado == 2
            ? "grey"
            : item.estado == 5
            ? "blue"
            : item.estado == 6
            ? "blue"
            : item.estado == 7
            ? "red"
            : item.estado == 8
            ? "grey"
            : item.estado == 9
            ? "red"
            : "red"
        }
      >
        {item.estado == -1
          ? "Eliminado"
          : item.estado == 1
          ? "Registrado"
          : item.estado == 2
          ? "Observado"
          : item.estado == 5
          ? "Enviado"
          : item.estado == 6
          ? "En proceso"
          : item.estado == 7
          ? "Anulado"
          : item.estado == 8
          ? "No registrado"
          : item.estado == 9
          ? "Duplicado"
          : "Sin estado"}
      </Badge>
    ),
    sortingField: "estado",
  },
  {
    id: "procedencia",
    header: "Procedencia",
    cell: (item) => item.procedencia,
    sortingField: "procedencia",
  },
];

const columnDisplay = [
  { id: "id", visible: true },
  { id: "codigo_registro", visible: true },
  { id: "tipo", visible: true },
  { id: "isbn", visible: true },
  { id: "issn", visible: true },
  { id: "editorial", visible: true },
  { id: "evento_nombre", visible: true },
  { id: "titulo", visible: true },
  { id: "fecha_publicacion", visible: true },
  { id: "estado", visible: true },
  { id: "procedencia", visible: true },
];

export default () => {
  //  States
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({});
  const [distributions, setDistribution] = useState([]);
  const {
    items,
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

  //  Hooks
  const { loading, options, setOptions, value, setValue, setAvoidSelect } =
    useAutosuggest("admin/admin/usuarios/searchInvestigadorBy");

  //  Functions
  const getData = async () => {
    setLoadingData(true);
    const res = await axiosBase.get("admin/estudios/publicaciones/listado", {
      params: {
        investigador_id: form.investigador_id,
      },
    });
    const data = await res.data;
    setDistribution(data.data);
    setLoadingData(false);
  };

  //  Effects
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (Object.keys(form).length != 0) {
      getData();
    }
  }, [form]);

  return (
    <Table
      {...collectionProps}
      trackBy="id"
      items={items}
      columnDefinitions={columnDefinitions}
      columnDisplay={columnDisplay}
      loading={loadingData}
      loadingText="Cargando datos"
      resizableColumns
      enableKeyboardNavigation
      selectionType="single"
      header={
        <Header
          counter={"(" + distributions.length + ")"}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <ButtonDropdown
                onItemClick={({ detail }) => {
                  if (detail.id == "action_1") {
                    setEditVisible(true);
                  } else if (detail.id == "action_2") {
                    setDeleteVisible(true);
                  }
                }}
                items={[
                  {
                    text: "Artículo de revista",
                    id: "action_1",
                    disabled: false,
                  },
                  {
                    text: "Capítulo de libro",
                    id: "action_2",
                    disabled: false,
                  },
                  {
                    text: "Libro",
                    id: "action_3",
                    disabled: false,
                  },
                  {
                    text: "Evento científico",
                    id: "action_4",
                    disabled: false,
                  },
                  {
                    text: "Tesis propia",
                    id: "action_5",
                    disabled: false,
                  },
                  {
                    text: "Tesis asesoría",
                    id: "action_6",
                    disabled: false,
                  },
                  {
                    text: "Patente",
                    id: "action_7",
                    disabled: false,
                  },
                ]}
              >
                Nuevo
              </ButtonDropdown>
              <Button
                variant="normal"
                disabled={!collectionProps.selectedItems.length}
              >
                Reporte
              </Button>
              <Button
                variant="primary"
                disabled={!collectionProps.selectedItems.length}
                onClick={() => {
                  const query = queryString.stringify({
                    id: collectionProps.selectedItems[0]["id"],
                  });
                  window.location.href =
                    "gestion_publicaciones/detalle?" + query;
                }}
              >
                Editar
              </Button>
            </SpaceBetween>
          }
        >
          Publicaciones
        </Header>
      }
      filter={
        <PropertyFilter
          {...propertyFilterProps}
          filteringPlaceholder="Buscar publicación"
          countText={`${filteredItemsCount} coincidencias`}
          expandToViewport
          virtualScroll
          customControl={
            <FormField label="Buscar por investigador" stretch>
              <Autosuggest
                onChange={({ detail }) => {
                  setOptions([]);
                  setValue(detail.value);
                  if (detail.value == "") {
                    setForm({});
                  }
                }}
                onSelect={({ detail }) => {
                  if (detail.selectedOption.investigador_id != undefined) {
                    setAvoidSelect(false);
                    const { value, ...rest } = detail.selectedOption;
                    setForm(rest);
                  }
                }}
                value={value}
                options={options}
                loadingText="Cargando data"
                placeholder="Código, dni o nombre del investigador"
                statusType={loading ? "loading" : "finished"}
                empty="No se encontraron resultados"
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
