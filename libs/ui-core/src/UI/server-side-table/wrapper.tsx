import { debounce } from "lodash";
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactElement,
} from "react";

export interface orgIdType {
  organization: string;
}

export type PaginationModel = {
  page: number;
  pageSize: number;
};

export const withServerSideTable = (
  WrappedComponent: any,
  fetchData: (
    orgId: orgIdType,
    paginationModel: PaginationModel,
    searchQuery: string,
    modelId?: any
  ) => Promise<any>
) =>
  /**
   * Enhanced Component
   * This component is a wrapper around a server-side table
   */
  function EnhancedComponent({ modelId, ...props }: any): ReactElement {
    const { orgId } = props;
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
      page: 0,
      pageSize: 5,
    });

    const searchQueryRef = useRef(searchQuery);

    const refresh = useCallback(async () => {
      setLoading(true);
      try {
        const data = await fetchData(
          orgId,
          paginationModel,
          searchQueryRef.current,
          modelId
        );

        setRows(data.items);
        setRowCount(data.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, [modelId, paginationModel, orgId]);

    useEffect(() => {
      refresh();
    }, [refresh]);

    const debounceSearch = debounce((refreshFunction) => {
      refreshFunction();
    }, 500);

    const debouncedSearch = useCallback(() => {
      debounceSearch(refresh);
    }, [refresh]);

    const handleSearchChange = async (event: any) => {
      const newSearchQuery = event.target.value;
      setSearchQuery(newSearchQuery);
      searchQueryRef.current = newSearchQuery;
      debouncedSearch();
    };

    return (
      <WrappedComponent
        modelId={modelId}
        loading={loading}
        rows={rows}
        rowCount={rowCount}
        refresh={refresh}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        {...props}
      />
    );
  };
