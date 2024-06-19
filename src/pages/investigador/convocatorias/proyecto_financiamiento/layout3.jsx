import { Wizard } from "@cloudscape-design/components";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import BaseLayout from "../../components/baseLayout";
import Paso3 from "./paso3";

const breadcrumbs = [
  {
    text: "Investigador",
    href: "/investigador",
  },
  {
    text: "Convocatorias",
  },
  {
    text: "Registrar",
  },
];

export default function Registrar_proyecto_paso3() {
  //  Url
  const location = useLocation();
  const { proyecto_id } = queryString.parse(location.search);

  if (proyecto_id == null) {
    window.location.href = "paso1";
  }

  //  Functions
  const handleNavigate = async (detail) => {
    if (detail.requestedStepIndex > 0) {
      const query = queryString.stringify({
        proyecto_id: proyecto_id,
      });
      window.location.href = "paso4?" + query;
    } else {
      const query = queryString.stringify({
        proyecto_id,
      });
      window.location.href = "paso2?" + query;
    }
  };

  return (
    <BaseLayout
      breadcrumbs={breadcrumbs}
      helpInfo="Información sobre la páginal actual para poder mostrarla al público
      en general."
      disableOverlap
      withoutContentLayout
    >
      <Wizard
        onNavigate={({ detail }) => handleNavigate(detail)}
        activeStepIndex={2}
        onCancel={() => {
          window.location.href = "../" + tipo;
        }}
        steps={[
          {
            title: "Información general",
          },
          {
            title: "Asesor",
          },
          {
            title: "Integrantes del proyecto",
            description: "Listado de miembros",
            content: <Paso3 proyecto_id={proyecto_id} />,
          },
          {
            title: "Descripción del proyecto",
          },
          {
            title: "Calendario de actividades",
          },
          {
            title: "Financiamiento del proyecto",
          },
          {
            title: "Instrucciones finales",
          },
        ]}
      />
    </BaseLayout>
  );
}
