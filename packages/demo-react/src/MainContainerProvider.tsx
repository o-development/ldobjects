import React, { useState, useEffect, createContext } from "react";
import type { FunctionComponent, PropsWithChildren } from "react";
import type { Container, LeafUri } from "@ldo/solid";
import { useSolidAuth, useLdo, useResource } from "@ldo/solid-react";

// Context will be set before any of it's children are rendered.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const MainContainerContext = createContext<Container>(undefined);

const MainContainerSubProvider: FunctionComponent<
  PropsWithChildren<{ uri: string }>
> = ({ uri, children }) => {
  const mainContainer = useResource(uri);
  return (
    <MainContainerContext.Provider value={mainContainer as Container}>
      {children}
    </MainContainerContext.Provider>
  );
};

export const MainContainerProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [mainContainer, setMainContainer] = useState<Container | undefined>();
  const { session } = useSolidAuth();
  const { getResource } = useLdo();

  useEffect(() => {
    if (session.webId) {
      const webIdResource = getResource(session.webId as LeafUri);
      webIdResource.getRootContainer().then(async (rootContainer) => {
        if (rootContainer.isError) {
          alert(rootContainer.message);
          return;
        }
        const mainContainer = getResource(`${rootContainer.uri}demo-react/`);
        setMainContainer(mainContainer);
        const createResult = await mainContainer.createIfAbsent();
        // Only set the access rules if the create was a success.
        if (createResult.type === "createSuccess") {
          await mainContainer.setAccessRules({
            public: {
              read: true,
              write: false,
              append: false,
              control: false,
            },
            agent: {
              [session.webId!]: {
                read: true,
                write: true,
                append: true,
                control: true,
              },
            },
          });
        }
      });
    }
  }, [session.webId]);

  if (!mainContainer) {
    return null;
  }

  return (
    <MainContainerSubProvider uri={mainContainer.uri}>
      {children}
    </MainContainerSubProvider>
  );
};
