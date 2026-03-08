import Accordion from 'react-bootstrap/Accordion';
import AddPlaceForm from './AddPlaceForm';

const AccordionForPlaceForm = ({ kindOfPlace, headerLabel, titlePlaceholder, descriptionPlaceholder, submitLabel}) => {
    return (
        <Accordion>
            <Accordion.Item eventKey='0'>
                <Accordion.Header>{headerLabel}</Accordion.Header>
                <Accordion.Body>
                    <AddPlaceForm 
                        kindOfPlace={kindOfPlace}
                        titlePlaceholder={titlePlaceholder}
                        descriptionPlaceholder={descriptionPlaceholder}
                        submitLabel={submitLabel}
                    />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default AccordionForPlaceForm;