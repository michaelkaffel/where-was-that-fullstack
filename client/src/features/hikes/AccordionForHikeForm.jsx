import Accordion from 'react-bootstrap/Accordion'
import AddHikeForm from './AddHikeForm';


  const AccordionForHikeForm = () => {

  return (
    <>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Add Hikes</Accordion.Header>
          <Accordion.Body>
            <AddHikeForm />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
    </>
  );
}

export default AccordionForHikeForm;