import React, { useState } from 'react'
import { Modal, ModalTitle, ModalContent, ModalActions, Button } from '@dhis2/ui'
import { PeriodDimension } from '@dhis2/analytics'

const PeriodSelectPopup = () => {
  const [selectedPeriods, setSelectedPeriods] = useState([])
  const [showModal, setShowModal] = useState(false)

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  const handleSelect = ({ items }) => {
    setSelectedPeriods(items)
    closeModal()
  }

  return (
    <>
      <Button onClick={openModal} primary>
        Select Reporting Period
      </Button>

      {showModal && (
        <Modal onClose={closeModal} large>
          <ModalTitle>Select a Reporting Period</ModalTitle>
          <ModalContent>
            <PeriodDimension
              selectedPeriods={selectedPeriods}
              onSelect={handleSelect}
              availablePeriodTypes={['Monthly', 'Yearly', 'Quarterly']}
              label="Select Period"
              placeholder="Pick a period..."
            />
          </ModalContent>
          <ModalActions>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalActions>
        </Modal>
      )}

      <div style={{ marginTop: '1rem' }}>
        <strong>Selected Periods:</strong>
        <pre>{JSON.stringify(selectedPeriods, null, 2)}</pre>
      </div>
    </>
  )
}

export default PeriodSelectPopup
