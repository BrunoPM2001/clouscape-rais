import {
  Box,
  Button,
  ColumnLayout,
  Container,
  DateInput,
  FormField,
  Header,
  Input,
  Multiselect,
  Select,
  SpaceBetween,
  StatusIndicator,
  TokenGroup,
} from "@cloudscape-design/components";
import { useContext, useEffect, useState } from "react";
import NotificationContext from "../../../../../../../providers/notificationProvider";
import { useFormValidation } from "../../../../../../../hooks/useFormValidation";

const initialForm = {
  doi: "",
  art_tipo: null,
  titulo: "",
  palabras_clave_input: "",
  palabras_clave: [],
  pagina_inicial: "",
  pagina_final: "",
  fecha_publicacion: "",
  publicacion_nombre: "",
  issn: "",
  issn_e: "",
  volumen: "",
  edicion: "",
  indexada: [],
  url: "",
};

const formRules = {
  doi: { required: false },
  art_tipo: { required: true },
  titulo: { required: true },
  palabras_clave: { required: true, noEmpty: true },
  pagina_inicial: { required: true },
  pagina_final: { required: true },
  fecha_publicacion: { required: true },
  publicacion_nombre: { required: true },
  issn: { required: true },
  issn_e: { required: false },
  volumen: { required: true },
  edicion: { required: true },
  indexada: { required: false },
  url: { required: false },
};

export default function ({ data }) {
  //  Context
  const { notifications, pushNotification } = useContext(NotificationContext);

  //  State
  const [revistasIndexadas, setRevistasIndexadas] = useState([]);

  //  Hooks
  const { formValues, formErrors, handleChange, validateForm, setFormValues } =
    useFormValidation(initialForm, formRules);

  const getData = async () => {
    setFormValues({
      ...initialForm,
      ...data.data,
      art_tipo: { value: data.data.art_tipo },
      palabras_clave: data.palabras_clave,
      indexada: data.indexada,
    });
    setRevistasIndexadas(data.revistas);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container
      header={
        <Header actions={<Button>Actualizar datos</Button>}>
          Datos del artículo
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="s">
        <ColumnLayout columns={2}>
          <FormField label="DOI" stretch errorText={formErrors.doi}>
            <Input
              placeholder="Escriba el doi"
              value={formValues.doi}
              onChange={({ detail }) => handleChange("doi", detail.value)}
            />
          </FormField>
          <FormField
            label="Tipo de artículo"
            stretch
            errorText={formErrors.art_tipo}
          >
            <Select
              placeholder="Escoja una opción"
              selectedOption={formValues.art_tipo}
              onChange={({ detail }) => {
                handleChange("art_tipo", detail.selectedOption);
              }}
              options={[
                { value: "Artículo original" },
                { value: "Artículo de revisión" },
                { value: "Comunicación o nota corta" },
              ]}
            ></Select>
          </FormField>
        </ColumnLayout>
        <FormField label="Título" stretch errorText={formErrors.titulo}>
          <Input
            placeholder="Escriba el título de la publicación"
            value={formValues.titulo}
            onChange={({ detail }) => handleChange("titulo", detail.value)}
          />
        </FormField>
        <FormField
          label="Palabras clave"
          description={
            <StatusIndicator type="warning">
              <Box
                variant="strong"
                color="text-status-warning"
                fontSize="body-s"
              >
                Presionar la tecla de enter para añadir una palabra
              </Box>
            </StatusIndicator>
          }
          stretch
          errorText={formErrors.palabras_clave}
        >
          <Input
            placeholder="Escriba las palabras clave de su publicación"
            value={formValues.palabras_clave_input}
            onChange={({ detail }) => {
              handleChange("palabras_clave_input", detail.value);
            }}
            onKeyDown={({ detail }) => {
              if (
                detail.key == "Enter" &&
                formValues.palabras_clave_input != ""
              ) {
                handleChange("palabras_clave", [
                  ...formValues.palabras_clave,
                  { label: formValues.palabras_clave_input },
                ]);
                handleChange("palabras_clave_input", "");
              }
            }}
          />
          <TokenGroup
            items={formValues.palabras_clave}
            onDismiss={({ detail: { itemIndex } }) => {
              handleChange("palabras_clave", [
                ...formValues.palabras_clave.slice(0, itemIndex),
                ...formValues.palabras_clave.slice(itemIndex + 1),
              ]);
            }}
          />
        </FormField>
        <ColumnLayout columns={3}>
          <FormField
            label="Página inicio"
            stretch
            errorText={formErrors.pagina_inicial}
          >
            <Input
              placeholder="N° de la pág. inicial"
              type="number"
              value={formValues.pagina_inicial}
              onChange={({ detail }) =>
                handleChange("pagina_inicial", detail.value)
              }
            />
          </FormField>
          <FormField
            label="Página final"
            stretch
            errorText={formErrors.pagina_final}
          >
            <Input
              placeholder="N° de la pág. final"
              type="number"
              value={formValues.pagina_final}
              onChange={({ detail }) =>
                handleChange("pagina_final", detail.value)
              }
            />
          </FormField>
          <FormField
            label="Año de publicación"
            stretch
            errorText={formErrors.fecha_publicacion}
          >
            <DateInput
              placeholder="YYYY/MM/DD"
              value={formValues.fecha_publicacion}
              onChange={({ detail }) =>
                handleChange("fecha_publicacion", detail.value)
              }
            />
          </FormField>
        </ColumnLayout>
        <Header>Datos de la revista</Header>
        <FormField
          label="Revista"
          stretch
          errorText={formErrors.publicacion_nombre}
        >
          <Input
            placeholder="Escriba la revista de su publicación"
            value={formValues.publicacion_nombre}
            onChange={({ detail }) =>
              handleChange("publicacion_nombre", detail.value)
            }
          />
        </FormField>
        <ColumnLayout columns={4}>
          <FormField label="ISSN" stretch errorText={formErrors.issn}>
            <Input
              placeholder="Escriba el ISSN"
              value={formValues.issn}
              onChange={({ detail }) => handleChange("issn", detail.value)}
            />
          </FormField>
          <FormField label="ISSN-E" stretch errorText={formErrors.issn_e}>
            <Input
              placeholder="Escriba el ISSN-E"
              value={formValues.issn_e}
              onChange={({ detail }) => handleChange("issn_e", detail.value)}
            />
          </FormField>
          <FormField label="Volumen" stretch errorText={formErrors.volumen}>
            <Input
              placeholder="Escriba el volumen de su publicación"
              value={formValues.volumen}
              onChange={({ detail }) => handleChange("volumen", detail.value)}
            />
          </FormField>
          <FormField label="Edición" stretch errorText={formErrors.edicion}>
            <Input
              placeholder="Escriba las edición de su publicación"
              value={formValues.edicion}
              onChange={({ detail }) => handleChange("edicion", detail.value)}
            />
          </FormField>
        </ColumnLayout>
        <FormField
          label="Publicación indexada en"
          stretch
          errorText={formErrors.indexada}
        >
          <Multiselect
            statusType={revistasIndexadas.length == 0 ? "loading" : "finished"}
            virtualScroll
            filteringType="auto"
            placeholder="Escoga las revistas"
            selectedOptions={formValues.indexada}
            onChange={({ detail }) =>
              handleChange("indexada", detail.selectedOptions)
            }
            options={[
              {
                label: "Grupo de revistas",
                options: revistasIndexadas,
              },
            ]}
          ></Multiselect>
        </FormField>
        <FormField
          label="URL de la publicación"
          stretch
          errorText={formErrors.url}
        >
          <Input
            placeholder="Escriba la URL de su publicación"
            value={formValues.url}
            onChange={({ detail }) => handleChange("url", detail.value)}
          />
        </FormField>
      </SpaceBetween>
    </Container>
  );
}