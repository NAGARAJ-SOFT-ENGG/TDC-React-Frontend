import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const CustomDataTable = ({
  data = [],
  columns = [],
  actions = null,
  paginationOptions = {},
  scrollHeight = '400px',
  onRowClick = null, // New prop for row click handler
}) => {
  const {
    rows = 10,
    rowsPerPageOptions = [ 10, 25, 50],
    paginatorLeft = null,
    paginatorRight = null,
    paginatorTemplate,
    currentPageReportTemplate = '{first} to {last} of {totalRecords}',
  } = paginationOptions;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const effectivePaginatorTemplate = paginatorTemplate
    ? paginatorTemplate
    : isMobile
      ? 'PrevPageLink NextPageLink'
      : 'RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink';
  
  const rowClassNameFn = (rowData) => {
    let classes = 'hover:bg-gray-100 transition-colors';
    if (onRowClick) classes += ' cursor-pointer';
    return classes;
  };

  return (
    <div className=" custom-table min-w-full rounded-md overflow-auto scroll-hide">
      <DataTable
        value={data}
        stripedRows
        paginator={paginationOptions !== false}
        rows={rows}
        rowsPerPageOptions={rowsPerPageOptions}
        paginatorTemplate={effectivePaginatorTemplate}
        currentPageReportTemplate={currentPageReportTemplate}
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        rowClassName={rowClassNameFn} // Apply dynamic row class
        className="w-full "
        scrollable
        scrollHeight={scrollHeight}
        responsiveLayout="scroll"
        onRowClick={onRowClick ? (e) => onRowClick(e.data) : undefined} // Pass row data to handler
      >
        {columns.map((col, index) => (
          <Column
            key={index}
            field={col.field}
            header={col.header}
            sortable={col.sortable ?? false}
            headerClassName=" textPrimary"
            bodyClassName=" textSecondary"
            body={col.body} // Pass the body template function from the column definition
          />
        ))}
        {actions && (
          <Column
            header="Actions"
            body={actions}
            headerClassName="textPrimary"
            bodyClassName="textSecondary"
          />
        )}
      </DataTable>
    </div>
  );
};
