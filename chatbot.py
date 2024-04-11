import streamlit as st
import os
from openai import OpenAI

OPENAI_API_KEY = os.environ['OPEN_AI_KEY']

template = f"""Here is some information about sepsis: Sepsis is a life-threatening condition that arises when the body’s response to an infection injures its own tissues and organs.

It occurs when the body’s immune system – which normally helps to protect us and fight infection – goes into overdrive. It can lead to shock, multiple organ failure and sometimes death, especially if not recognised early and treated promptly.

Sepsis is indiscriminate: while it primarily affects very young children and older adults, and is also more common in people with underlying health conditions, it can sometimes be triggered in those who are otherwise fit and healthy.

Sepsis always starts with an infection, and can be triggered by any infection including chest infections and UTIs. It is not known why some people develop sepsis in response to these common infections whereas others don’t.

5 people die with sepsis every hour in the UK. By helping us to reach more people with the signs of sepsis, we can work towards ending preventable deaths from this condition. 

Today's date is 11/04/2024. On 12/04/2024, there is a webinar at 11pm today to spread awareness on Sepsis. The mission statement of Sepsis UK. The UK Sepsis Trust was founded in 2012 by NHS consultant, Dr Ron Daniels BEM. Renowned for his systems and translational expertise, Ron had spent the previous 7 years developing and disseminating the Sepsis 6 pathway across the NHS and globally.

Our goal is to end preventable deaths from sepsis and improve outcomes for sepsis survivors. We believe that earlier diagnosis and treatment across the UK would save several thousand lives a year.

Our critical expertise is based on the charity’s grassroots origins: our doctors and nurses have front line experience of sepsis and their passion is born of a uniquely comprehensive understanding of what needs to be done.

OUR VISION
We want to end preventable deaths from sepsis.

OUR MISSION
We seek to save lives from sepsis, and improve outcomes for survivors, by instigating political change, educating healthcare professionals, raising public awareness and providing support for those affected by this devastating condition. We will protect people by enabling the prevention of severe infection and the treatment of sepsis, whilst helping to ensure antibiotics are used responsibly.

For the next steps in our critical mission, we need to work with others on large-scale research programmes, in order to:

Further develop our understanding of sepsis, severe infection and use of antimicrobials
Robustly examine the effectiveness of systems change and clinical practice

WHAT WE DO
We work to raise awareness of sepsis among the public and health care professionals; encourage early diagnosis; lobby politicians to improve standards of care; and provide better support for sepsis survivors.

OUR IMPACT
With our supporters’ help, since our foundation in 2012 we’ve put sepsis on the national and global agenda:

Survival rates from sepsis in the UK increased from 70% in 2012 to 80% in 2019 and every year we support thousands of people in their recovery or bereavement
Our ‘Just ask: could it be sepsis?’ campaign has gained widespread support and media coverage. Public awareness that sepsis is a medical emergency has risen from a baseline of 27% in 2012 to 76% in 2019 (YouGov polls)
In 2016, The National Institute for Health & Care Excellence (NICE) joined forces with UKST to release a new guideline to improve sepsis care across the NHS
We developed the Sepsis Six as a practical tool to help healthcare professionals deliver the basics of care rapidly and reliably. It has been endorsed by NICE and is used in 96% of British hospitals and in 37 other countries worldwide
In 2017, the World Health Organisation adopted a resolution on sepsis to improve care globally and help reduce the annual death toll of six million people worldwide"""


st.title("Chatbot")

# Set OpenAI API key from Streamlit secrets
client = OpenAI(api_key=OPENAI_API_KEY)

# Set a default model
if "openai_model" not in st.session_state:
    st.session_state["openai_model"] = "gpt-3.5-turbo-0125"

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Accept user input
if prompt := st.chat_input("What is up?"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)
    # Display assistant response in chat message container
    conversation_history = [
                {"role": m["role"], "content": m["content"]}
                for m in st.session_state.messages
            ]
    conversation_history.insert(0, {"role": "system", "content":template})

    with st.chat_message("assistant"):
        stream = client.chat.completions.create(
            model=st.session_state["openai_model"],
            messages=conversation_history,
            stream=True,
        )
        response = st.write_stream(stream)
    st.session_state.messages.append({"role": "assistant", "content": response})