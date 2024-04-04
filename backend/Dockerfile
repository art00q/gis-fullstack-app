FROM python:3
EXPOSE 5000
WORKDIR /app
COPY requirements.txt /app
RUN pip3 install -r requirements.txt
COPY * /app
CMD ["flask", "--app", "app.py", "--debug", "run", "--host", "0.0.0.0"]