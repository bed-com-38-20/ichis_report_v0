import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import {
    ButtonStrip,
    Card,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    InputField,
    FileInputField,
    Button,
} from '@dhis2/ui'
import { useParams, useNavigate } from 'react-router-dom'

import styles from './styles/EditTableTemplate.style'
import {
    EditTableCell,
    AddTableDimension,
    HighlightingEditor,
    RowColControls,
    RenameTable,
    EditTableTemplateActions,
} from './edit-table-template'
import BackButton from '../../components/BackButton'
import utils from '../../styles/utils.module.css'
import i18n from '../../locales'
import { TABLES, getPath, GENERATED_TABLE } from '../../modules/paths'
import { useTableActions, useTableState, useTableDispatch } from '../../context/tableContext'
import HelpButton from '../../components/HelpButton'
import AutosaveStatus from './edit-table-template/AutosaveStatus'

export function EditTableTemplate() {
    const params = useParams()
    const table = useTableState()
    const dataStoreActions = useTableActions()
    const navigate = useNavigate()
    const dispatch = useTableDispatch()
    const tableActions = useTableActions()

    // Save table to datastore in response to changes
    useEffect(() => {
        dataStoreActions.update({ ...table })
    }, [table])

    function onDelete() {
        dataStoreActions.remove()
        history.push(TABLES)
    }

    function onGenerate() {
        navigate(getPath(GENERATED_TABLE, params.id))
    }

    function renameTable(name) {
        dispatch({ type: 'SET_NAME', payload: name })
        dataStoreActions.update({ ...table, name })
    }


    const [logo, setLogo] = useState(table.logo || '')
    const [description, setDescription] = useState(table.description || '')

    const handleLogoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogo(reader.result)

                // Dispatch to context
                dispatch({ type: 'SET_LOGO', payload: reader.result })

                // Persist to datastore
                tableActions.update({ ...table, logo: reader.result })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDescriptionChange = (e) => {
        const value = e.target.value
        setDescription(value)

        // Dispatch to context
        dispatch({ type: 'SET_DESCRIPTION', payload: value })

        // Persist to datastore
        tableActions.update({ ...table, description: value })
    }

    function handleRemoveLogo() {
        dataStoreActions.update({
            ...table,
            logo: null
        });
    }

    function tableColumns() {
        return (
            <TableRowHead>
                <TableCellHead />
                {table.columns.map((col, idx, arr) => (
                    <RowColControls
                        type="column"
                        rowColObj={col}
                        idx={idx}
                        maxIdx={arr.length - 1}
                        key={idx}
                    />
                ))}
            </TableRowHead>
        )
    }

    function mapCellsToJsx(cells, rowIdx) {
        return cells.map((cell, idx) => (
            <EditTableCell
                rowIdx={rowIdx}
                cellIdx={idx}
                cell={cell}
                key={idx}
            />
        ))
    }

    function tableRows() {
        return table.rows.map((row, idx, arr) => (
            <TableRow idx={idx} key={idx}>
                <RowColControls
                    type={'row'}
                    rowColObj={row}
                    idx={idx}
                    maxIdx={arr.length - 1}
                />
                {mapCellsToJsx(row.cells, idx)}
            </TableRow>
        ))
    }

    return (
        <>
            <header className="header">
                <div>
                    <BackButton
                        to={TABLES}
                        text={i18n.t('Back to Saved Tables')}
                    />
                    <div className="pageTitle">
                        <h1>{i18n.t('Edit Table')}</h1>
                        <HelpButton subsection="#editing-a-table-template" />
                    </div>
                </div>
                <EditTableTemplateActions
                    onGenerate={onGenerate}
                    onDelete={onDelete}
                />
            </header>

            <section className="controls">
                <div>
                    <div className="container">
                        <h6 className="label">{i18n.t('Template name')}</h6>
                        <div className="tableName">
                            <div>{table.name}</div>
                            <RenameTable
                                name={table.name}
                                onRename={renameTable}
                            />
                        </div>
                    </div>

                    {/* logo upload field */}
                    <div>
                        <label>Upload Logo:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                        />
                        {
                            logo &&
                            <img src={logo}
                                alt="Uploaded Logo"
                                style={{
                                    maxHeight: 100,
                                    marginTop: 10
                                }} />
                        }
                    </div>

                    {/* <div className="container">
                        <FileInputField

                            onChange={handleLogoChange}
                            accept="image/*"
                            buttonLabel={i18n.t('Upload Logo')}
                            disabled={false}
                            name="logoUpload"
                            key={table.logo ? 'has-logo' : 'no-logo'}
                        />
                        {table.logo && (
                            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={table.logo}
                                    alt="Preview"
                                    style={{ maxHeight: '50px', marginRight: '8px' }}
                                />
                                <Button small onClick={handleRemoveLogo}>
                                    {i18n.t('Remove')}
                                </Button>
                            </div>
                        )}
                    </div> */}

                    {/* description field */}

                    <div>
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={handleDescriptionChange}
                            rows={3}
                            style={{
                                width: '100%'
                            }}
                        />
                    </div>
                    {/* <div className="container">
                        <InputField
                            label={i18n.t('Description (optional)')}
                            value={table.description || ''}
                            onChange={handleDescriptionChange}
                            placeholder={i18n.t('Enter table description...')}
                            name="tableDescription"
                            type="text"
                        />
                    </div> */}

                    <HighlightingEditor />
                </div>
                <ButtonStrip end>
                    <AddTableDimension type="Row" />
                    <AddTableDimension type="Column" />
                </ButtonStrip>
            </section>


            <section>
                <Card className={utils.card}>
                    <Table className={utils.noBorder}>
                        <TableHead>{tableColumns()}</TableHead>
                        <TableBody>{tableRows()}</TableBody>
                    </Table>
                </Card>
            </section>
            <footer>
                <AutosaveStatus />
            </footer>
            <style jsx>{styles}</style>
        </>
    )
}

EditTableTemplate.propTypes = {}

export default EditTableTemplate
