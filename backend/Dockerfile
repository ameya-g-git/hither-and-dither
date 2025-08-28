FROM python:3.12-slim

COPY . ./app/

WORKDIR /app/

RUN pip install -r requirements.txt

EXPOSE 4001

CMD [ "python3", "run.py" ]